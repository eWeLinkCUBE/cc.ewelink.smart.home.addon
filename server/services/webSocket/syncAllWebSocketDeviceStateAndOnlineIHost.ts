import logger from '../../log';
import _ from 'lodash';
import { WEB_SOCKET_UIID_DEVICE_LIST } from '../../const';
import db from '../../utils/db';
import syncDeviceOnlineIHost from '../public/syncDeviceOnlineToIHost';
import { sleep } from '../../utils/timeUtils';
import syncWebSocketDeviceStateToIHost from './syncWebSocketDeviceStateToIHost';

export default async function syncAllWebSocketDeviceStateAndOnlineIHost() {
    try {
        logger.info('syncAllWebSocketDeviceStateAndOnlineIHost--------------');
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');

        if (!eWeLinkDeviceList) {
            return;
        }

        for (const item of eWeLinkDeviceList) {
            const { uiid } = item.itemData.extra;
            const { deviceid, online } = item.itemData;
            if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
                logger.info('sync device websocket device state and online to iHost-----', deviceid, online);
                //设备离线不同步状态(Device offline and out of sync status)
                await sleep(50);

                if (online) {
                    await syncWebSocketDeviceStateToIHost(deviceid, item.itemData.params);
                } else {
                    await syncDeviceOnlineIHost(deviceid, online);
                }
            }
        }
    } catch (error: any) {
        logger.error('sync zigbee device state to iHost-----------------------------', error);
        return null;
    }
}
