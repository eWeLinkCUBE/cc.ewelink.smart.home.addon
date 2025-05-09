import db from '../utils/db';
import logger from '../log';
import syncAllWebSocketDeviceOffline from '../services/webSocket/syncAllWebSocketDeviceOffline'
import CoolKitWs from '../lib/coolkit-ws';

function toLogout() {
    try {
        logger.info('quit login------------------------------');

        //clear data
        db.setDbValue('eWeLinkApiInfo', null);
        db.setDbValue('autoSyncStatus', false);
        db.setDbValue('atUpdateTime', 0);
        db.setDbValue('eWeLinkDeviceList', []);
        //关闭websocket连接（Close websocket connection）
        logger.info('close websocket ------------');
        CoolKitWs.close();
        syncAllWebSocketDeviceOffline();
    } catch (error: any) {
        logger.error(`login out code error--------------------- ${error.message}`);
    }
}

export default toLogout;