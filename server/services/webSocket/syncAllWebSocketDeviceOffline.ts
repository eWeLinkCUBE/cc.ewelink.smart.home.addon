import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST } from '../../const';
import db from '../../utils/db';
import { decode } from 'js-base64';
import syncDeviceOnlineIHost from '../public/syncDeviceOnlineToIHost';
import logger from '../../log';
import deviceStateUtil from '../../utils/deviceStateUtil';

export default async function syncAllWebSocketDeviceOffline() {
    let eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');

    eWeLinkDeviceList = eWeLinkDeviceList.map((item) => {
        item.itemData.online = false;
        return item;
    });

    //存入数据库 (Save to database)
    db.setDbValue('eWeLinkDeviceList', eWeLinkDeviceList);

    const iHostDeviceList = db.getDbValue('iHostDeviceList');

    if (!iHostDeviceList) {
        return;
    }
    for (const item of iHostDeviceList) {
        if (!item.tags?.deviceInfo) continue;
        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));

        const { uiid, deviceId } = deviceInfo;

        if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            logger.info('uiid--------------', uiid);

            await syncDeviceOnlineIHost(deviceId, false);
        }

        if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            logger.info('uiid--------------', uiid);

            const isInLanProtocol = deviceStateUtil.isInLanProtocol(deviceId);

            if (!isInLanProtocol) {
                await syncDeviceOnlineIHost(deviceId, false);
            }
        }
    }
}
