import { WEB_SOCKET_UIID_DEVICE_LIST } from '../../const';
import db from '../../utils/db';
import { decode } from 'js-base64';
import syncDeviceOnlineIHost from '../public/syncDeviceOnlineToIHost';
import logger from '../../log';

export default async function syncAllWebSocketDeviceOffline() {
    const iHostDeviceList = db.getDbValue('iHostDeviceList');

    if (!iHostDeviceList) {
        return;
    }
    for (const item of iHostDeviceList) {
        if (!item.tags?.deviceInfo) continue;
        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));

        if (WEB_SOCKET_UIID_DEVICE_LIST.includes(deviceInfo.uiid)) {
            logger.info('uiid--------------', deviceInfo.uiid);
            await syncDeviceOnlineIHost(deviceInfo.deviceId, false);
        }
    }
}
