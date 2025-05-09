import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST } from '../../constants/uiid';
import db from '../../utils/db';
import { decode } from 'js-base64';
import syncDeviceOnlineToIHost from '../public/syncDeviceOnlineToIHost';
import logger from '../../log';
import deviceStateUtil from '../../utils/deviceStateUtil';
import deviceDataUtil from '../../utils/deviceDataUtil';
import EUiid from '../../ts/enum/EUiid';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';

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
        const { deviceId } = deviceInfo;
        const operateInstance = getUiidOperateInstance(deviceId);
        await operateInstance?.syncWebsocketDeviceOffline();
    }
}
