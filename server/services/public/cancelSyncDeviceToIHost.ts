import { deleteDevice } from '../../api/iHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import EUiid from '../../ts/enum/EUiid';

/** 取消同步eWeLink设备到iHost (Unsynchronize eWelink device to iHost)*/
export default async function cancelSyncDeviceToIHost(deviceId: string) {
    try {
        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);
        if ([EUiid.uiid_28].includes(uiid)) {
            const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);
            if (!iHostDeviceDataList) {
                logger.error('to cancel sync device can not find this deviceList-----------------', iHostDeviceDataList);
                return null;
            }

            const requestList = iHostDeviceDataList.map((item) => {
                return deleteDevice(item.serial_number);
            });

            const resList = await Promise.all(requestList);
            logger.info('resList--------------------------------', resList);
            const allSuccess = resList.every((item) => item.error === 0);
            if (!allSuccess) {
                return null;
            }
            return resList[0];
        }

        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(deviceId);
        if (!iHostDeviceData) {
            logger.error('to cancel sync device can not find this device-----------------', iHostDeviceData);
            return null;
        }

        logger.info('cancel to sync device------------------------------------------------deviceId', iHostDeviceData.serial_number);
        const res = await deleteDevice(iHostDeviceData.serial_number);

        return res;
    } catch (error: any) {
        logger.error('cancel sync device code error---------------------', deviceId, error);
        return null;
    }
}
