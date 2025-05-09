import logger from '../../log';
import db from '../../utils/db';
import { sleep } from '../../utils/timeUtils';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';

export default async function syncAllWebSocketDeviceStateAndOnlineIHost() {
    try {
        logger.info('syncAllWebSocketDeviceStateAndOnlineIHost--------------');
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');

        if (!eWeLinkDeviceList) {
            return;
        }

        for (const item of eWeLinkDeviceList) {
            const { deviceid, online } = item.itemData;
            await sleep(50);

            const operateInstance = getUiidOperateInstance(deviceid);

            if (online) {
                await operateInstance?.syncDeviceStateToIHostByWebsocket(item.itemData.params);
            } else {
                await operateInstance?.syncWebsocketDeviceOffline();
            }
        }
    } catch (error: any) {
        logger.error('sync zigbee device state to iHost-----------------------------', error);
        return null;
    }
}
