import _ from 'lodash';
import logger from '../../log';
import db from '../../utils/db';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';
import Uiid28 from '../uiid/uiid28';

/** 更新易微联设备的 tags */
export default async function toUpdateEWeLinkDeviceTags() {
    try {
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
        if (!eWeLinkDeviceList) {
            return;
        }

        for (const item of eWeLinkDeviceList) {
            const deviceId = item.itemData.deviceid;
            const operateInstance = getUiidOperateInstance<Uiid28>(deviceId);
            await operateInstance?.updateEWeLinkDeviceTags?.(false);
        }
    } catch (error: any) {
        logger.error('updateEWeLinkRfDeviceTags code error---------------------------', error);
        return null;
    }
}
