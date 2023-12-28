import _ from 'lodash';
import { syncDeviceOnlineToIHost } from '../../api/iHost';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import EUiid from '../../ts/enum/EUiid';
import syncRfDeviceOnlineToIHost from '../rf/syncRfDeviceOnlineToIHost';

/** 设备上下线状态上报 (Report device online and offline status)*/
export default async function syncDeviceOnlineIHost(deviceId: string, isOnline: boolean) {
    try {
        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);

        //网关下子设备全部上下线 (All sub-devices under the gateway are online and offline)
        if ([EUiid.uiid_28].includes(uiid)) {
            syncRfDeviceOnlineToIHost(deviceId, isOnline);
            return;
        }
        //zigbee-p 网关不作处理，都在sse里维护 (The zigbee-p gateway does not process it and maintains it in sse.)
        if ([EUiid.uiid_168].includes(uiid)) {
            return;
        }

        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(deviceId);

        //这个设备未同步 (This device is not synced)
        if (!iHostDeviceData) {
            logger.info('this device not sync ---------', uiid, deviceId);
            return;
        }
        //在线状态相同不更新状态 (If the online status is the same, the status will not be updated.)
        if (iHostDeviceData.isOnline === isOnline) {
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
                    serial_number: iHostDeviceData.serial_number,
                    third_serial_number: deviceId,
                },
                payload: {
                    online: isOnline,
                },
            },
        };

        logger.info('sync device online or offline------', deviceId, uiid, isOnline);
        const res = await syncDeviceOnlineToIHost(params);

        if (res.header.name === 'Response') {
            deviceDataUtil.updateIHostDeviceDataOnline(iHostDeviceData.serial_number, isOnline);
        }

        return res;
    } catch (error: any) {
        logger.error('sync device online or offline code error------------------------------------------------', error);
        return null;
    }
}
