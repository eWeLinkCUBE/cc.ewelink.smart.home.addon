import _ from 'lodash';
import logger from '../../log';
import db from '../../utils/db';
import EUiid from '../../ts/enum/EUiid';
import updateEWeLinkRfDeviceTags from './updateEWeLinkRfDeviceTags';

export default async function toUpdateEWeLinkRfDeviceTags() {
    try {
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
        if (!eWeLinkDeviceList) {
            return;
        }

        for (const item of eWeLinkDeviceList) {
            const { uiid } = item.itemData.extra;
            const deviceId = item.itemData.deviceid;

            if (EUiid.uiid_28 !== uiid) {
                continue;
            }

            await updateEWeLinkRfDeviceTags(deviceId, false);
        }
    } catch (error: any) {
        logger.error('updateEWeLinkRfDeviceTags code error---------------------------', error);
        return null;
    }
}
