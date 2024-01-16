import _ from 'lodash';
import { syncDeviceOnlineToIHost } from '../../api/iHost';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import EUiid from '../../ts/enum/EUiid';
import getZigbeePAllDeviceList from './getZigbeePAllDeviceList';
import zigbeePOnlineMap from '../../ts/class/zigbeePOnlineMap';
import zigbeePSseMap from '../../ts/class/zigbeePSseMap';
import db from '../../utils/db';
import { decode } from 'js-base64';
import diffZigbeeSubDeviceAndEWelinkDevice from './diffZigbeeSubDeviceAndEWelinkDevice';

/** zigbee-p子设备上下线状态上报  (Zigbee p sub-device online and offline status reporting) */
export default async function syncZigbeeDeviceOnlineToIHost(deviceId: string, isOnline: boolean) {
    try {
        if (!isOnline) {
            toOfflineAllZigbeePDevices(deviceId);
            return;
        }

        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);

        if (uiid !== EUiid.uiid_168) {
            return;
        }

        const allZigbeeDevices = await getZigbeePAllDeviceList(deviceId);

        if (!allZigbeeDevices) {
            return;
        }
        //判断子设备与云端缓存的区别，是否需要同步和取消同步
        const allZigbeeDeviceIdList = allZigbeeDevices.map((item) => item.deviceid);
        diffZigbeeSubDeviceAndEWelinkDevice(deviceId, allZigbeeDeviceIdList);

        for (const subDeviceInfo of allZigbeeDevices) {
            const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(subDeviceInfo.deviceid);
            // 保存在线状态，用于smart-home的前端页面
            // Save online status for the front-end page of smart home
            zigbeePOnlineMap.zigbeePSubDevicesMap.set(subDeviceInfo.deviceid, subDeviceInfo.online);
            // 这个设备未同步 (This device is not synced)
            if (!iHostDeviceData) {
                continue;
            }
            //子设备在线 (Sub-device online)
            const online = subDeviceInfo.online;

            const params = {
                event: {
                    header: {
                        name: 'DeviceOnlineChangeReport',
                        message_id: uuidv4(),
                        version: '1',
                    },
                    endpoint: {
                        serial_number: iHostDeviceData.serial_number,
                        third_serial_number: subDeviceInfo.deviceid,
                    },
                    payload: {
                        online,
                    },
                },
            };

            logger.info('sync zigbee device online or offline--------------zigbee subDevice offline', subDeviceInfo.deviceid, isOnline);

            syncDeviceOnlineToIHost(params);
        }
    } catch (error: any) {
        logger.error('sync zigbee device online or offline code error----------------zigbee subDevice offline', error);
        return null;
    }
}

function toOfflineAllZigbeePDevices(parentId: string) {
    const iHostDeviceList = db.getDbValue('iHostDeviceList');

    if (!iHostDeviceList) {
        return;
    }

    const deviceIdList = iHostDeviceList.map((item) => {
        if (!item.tags?.deviceInfo) return null;
        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
        if (deviceInfo) {
            return { deviceId: deviceInfo.deviceId as string, parentId: deviceInfo?.parentId as string, online: item.online, serial_number: item.serial_number };
        }
        return null;
    });

    _.remove(deviceIdList, (item) => {
        if (item === null) {
            return true;
        }
        if (item.parentId === parentId) {
            return false;
        }
        return true;
    });

    deviceIdList.forEach((item) => {
        if (!item) {
            return;
        }
        if (item.online === false) {
            return;
        }
        const params = {
            event: {
                header: {
                    name: 'DeviceOnlineChangeReport',
                    message_id: uuidv4(),
                    version: '1',
                },
                endpoint: {
                    serial_number: item.serial_number,
                    third_serial_number: item.deviceId,
                },
                payload: {
                    online: false,
                },
            },
        };

        logger.info('sync zigbee device online or offline---------------zigbeeP offline', item?.deviceId, false);
        // 保存在线状态，用于smart-home的前端页面
        // Save online status for the front-end page of smart home
        zigbeePOnlineMap.zigbeePSubDevicesMap.set(item.deviceId, false);
        syncDeviceOnlineToIHost(params);
    });
}
