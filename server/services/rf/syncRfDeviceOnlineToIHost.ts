import _ from 'lodash';
import { syncDeviceOnlineToIHost } from '../../api/iHost';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';

/** 设备上下线状态上报 (Report device online and offline status)*/
export default async function syncRfDeviceOnlineToIHost(deviceId: string, isOnline: boolean) {
    try {
        //网关下子设备全部上下线 (All sub-devices under the gateway are online and offline)
        const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);

        if (!iHostDeviceDataList) return;

        const isAllOnline = iHostDeviceDataList.every((item) => item.online);

        //全在线 (Fully online)
        if (isOnline === isAllOnline) {
            return;
        }

        for (const item of iHostDeviceDataList) {
            const params = {
                event: {
                    header: {
                        name: 'DeviceOnlineChangeReport',
                        message_id: uuidv4(),
                        version: '1',
                    },
                    endpoint: {
                        serial_number: item.serial_number,
                        third_serial_number: deviceId,
                    },
                    payload: {
                        online: isOnline,
                    },
                },
            };
            logger.info('sync rf device online ----------', isOnline, item.serial_number, item.online);
            const res = await syncDeviceOnlineToIHost(params);
            if (res.header.name === 'ErrorResponse') {
                logger.info('sync rf device online ----------res', res);
            }
        }
    } catch (error: any) {
        logger.error('sync device online or offline code error------------------------------------------------', error);
        return null;
    }
}
