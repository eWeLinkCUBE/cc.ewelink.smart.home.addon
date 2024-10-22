import logger from '../../log';
import _ from 'lodash';
import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST, ZIGBEE_UIID_DEVICE_LIST } from '../../const';
import db from '../../utils/db';
import syncDeviceOnlineIHost from '../public/syncDeviceOnlineToIHost';
import { sleep } from '../../utils/timeUtils';
import syncWebSocketDeviceStateToIHost from './syncWebSocketDeviceStateToIHost';
import deviceStateUtil from '../../utils/deviceStateUtil';
import deviceDataUtil from '../../utils/deviceDataUtil';
import EUiid from '../../ts/enum/EUiid';

export default async function syncAllWebSocketDeviceStateAndOnlineIHost() {
    try {
        logger.info('syncAllWebSocketDeviceStateAndOnlineIHost--------------');
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');

        if (!eWeLinkDeviceList) {
            return;
        }

        for (const item of eWeLinkDeviceList) {
            let { uiid } = item.itemData.extra;
            const { deviceid, online } = item.itemData;
            await sleep(50);

            // zigbee-U子设备由zigbee-U决定(zigbee-U sub-device is determined by zigbee-U)
            if (deviceDataUtil.isZigbeeUSubDevice(deviceid)) {
                logger.info('zigbeeU------------------', deviceid);
                uiid = EUiid.uiid_243;
            }

            if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
                logger.info('sync device websocket device state and online to iHost-----', deviceid, online);
                //设备离线不同步状态(Device offline and out of sync status)
                if (online) {
                    await syncWebSocketDeviceStateToIHost(deviceid, item.itemData.params, uiid);
                } else {
                    await syncDeviceOnlineIHost(deviceid, online);
                }
            }

            if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
                logger.info('sync device websocket device state and online to iHost-----', deviceid, online);

                //设备离线不同步状态(Device offline and out of sync status)
                if (online) {
                    //同步设备状态会将设备上线（Synchronizing device status will bring the device online）
                    await syncWebSocketDeviceStateToIHost(deviceid, item.itemData.params, uiid);
                } else {
                    const isInLanProtocol = deviceStateUtil.isInLanProtocol(item);
                    if (!isInLanProtocol) {
                        await syncDeviceOnlineIHost(deviceid, online);
                    }
                }
            }
        }
    } catch (error: any) {
        logger.error('sync zigbee device state to iHost-----------------------------', error);
        return null;
    }
}
