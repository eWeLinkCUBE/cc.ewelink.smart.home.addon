import { deleteDevice } from '../../api/iHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import db from '../../utils/db';
import _ from 'lodash';
import EUiid from '../../ts/enum/EUiid';

/** 取消同步eWeLink设备到iHost (Unsynchronize eWelink device to iHost)*/
export default async function cancelSyncZigbeeDeviceToIHostBySse(deviceId: string) {
    try {
        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(deviceId);
        //已同步的子设备，取消同步
        if (iHostDeviceData) {
            logger.info('cancel to sync zigbee device----------------------deviceId', deviceId, iHostDeviceData.serial_number);
            await deleteDevice(iHostDeviceData.serial_number);
        }
        //删除本地云端数据中设备
        deleteEWeLinkDataZigbeePSubDevice(deviceId);
    } catch (error: any) {
        logger.error('cancel sync zigbee device code error---------------------', deviceId, error);
        return null;
    }
}

/** 把zigbee-p子设备数据删掉 (Delete zigbee p sub-device data)*/
function deleteEWeLinkDataZigbeePSubDevice(deviceId: string) {
    const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
    logger.info('delete zigbee-p subDevice-----', deviceId);
    _.remove(eWeLinkDeviceList, (item) => item.itemData.deviceid === deviceId);

    const list = eWeLinkDeviceList.map((eWeLinkDeviceData) => {
        const { uiid } = eWeLinkDeviceData.itemData.extra;
        if (uiid === EUiid.uiid_168) {
            _.remove(eWeLinkDeviceData.itemData.params.subDevices, (item: { deviceid: string }) => item.deviceid === deviceId);
        }
        return eWeLinkDeviceData;
    });
    db.setDbValue('eWeLinkDeviceList', list);
}
