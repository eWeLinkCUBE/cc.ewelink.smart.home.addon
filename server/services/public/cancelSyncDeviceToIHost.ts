import { deleteDevice } from '../../api/iHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import EUiid from '../../ts/enum/EUiid';

/** 取消同步eWeLink设备到iHost (Unsynchronize eWelink device to iHost)*/
export default async function cancelSyncDeviceToIHost(deviceId: string) {
    try {
        let realDeviceId;

        if (deviceId.indexOf('_') > -1) {
            realDeviceId = deviceId.split('_')[0];
        } else {
            realDeviceId = deviceId;
        }

        const uiid = deviceDataUtil.getUiidByDeviceId(realDeviceId);
        if ([EUiid.uiid_28].includes(uiid)) {
            const remoteIndex = Number(deviceId.split('_')[1]);
            const serial_number = deviceDataUtil.getRfSerialNumberByDeviceIdAndIndex(realDeviceId, remoteIndex);

            logger.info('cancel to sync rf device------------------------------------------------realDeviceId', serial_number);
            if (!serial_number) {
                return null;
            }
            return await deleteDevice(serial_number);
        }

        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(realDeviceId);
        if (!iHostDeviceData) {
            logger.error('to cancel sync device can not find this device-----------------', iHostDeviceData);
            return null;
        }

        logger.info('cancel to sync device------------------------------------------------realDeviceId', iHostDeviceData.serial_number);
        const res = await deleteDevice(iHostDeviceData.serial_number);

        return res;
    } catch (error: any) {
        logger.error('cancel sync device code error---------------------', deviceId, error);
        return null;
    }
}
