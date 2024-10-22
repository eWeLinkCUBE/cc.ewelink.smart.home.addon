import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST } from '../../const';
import db from '../../utils/db';
import { decode } from 'js-base64';
import syncDeviceOnlineIHost from '../public/syncDeviceOnlineToIHost';
import logger from '../../log';
import deviceStateUtil from '../../utils/deviceStateUtil';
import deviceDataUtil from '../../utils/deviceDataUtil';
import EUiid from '../../ts/enum/EUiid';

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

        let { uiid } = deviceInfo;
        const { deviceId } = deviceInfo;
        // zigbee-U子设备由zigbee-U决定(zigbee-U sub-device is determined by zigbee-U)
        if (deviceDataUtil.isZigbeeUSubDevice(deviceId)) {
            uiid = EUiid.uiid_243;
        }

        if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            await syncDeviceOnlineIHost(deviceId, false);
        }

        if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            const isInLanProtocol = deviceStateUtil.isInLanProtocol(deviceId);

            if (!isInLanProtocol) {
                await syncDeviceOnlineIHost(deviceId, false);
            }
        }
    }
}
