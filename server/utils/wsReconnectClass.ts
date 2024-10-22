import CoolKitWs from '../lib/coolkit-ws';
import logger from '../log';
import getEwelinkAllDeviceList from '../services/public/getEwelinkAllDeviceList';
import syncAllWebSocketDeviceOffline from '../services/webSocket/syncAllWebSocketDeviceOffline';
import wsService from '../services/webSocket/wsService';
import IWSConfig from '../ts/interface/IWSConfig';
import db from './db';

class WsReconnectClass {
    private reconnectTimeout = 5000; // 初始重连延迟时间（毫秒）Initial reconnection delay time (milliseconds)
    private maxReconnectTimeout = 2 * 60 * 60 * 1000; // 最大重连延迟时间（毫秒）Maximum reconnection delay time (milliseconds)
    private maxBackoffFactor = 2;
    private reconnectTimer: NodeJS.Timeout | null = null;

    isNeedReconnect() {
        if (this.reconnectTimer) {
            return false;
        }

        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
        if (!eWeLinkApiInfo) {
            return false;
        }
        return true;
    }

    reconnectSuccess() {
        getEwelinkAllDeviceList();
        CoolKitWs.on('message', (ev) => wsService.listenWs(ev));
        CoolKitWs.on('reconnect', (data) => {
            logger.info('reconnect----------------wsReconnect', data);
            if (data.error == 0) {
                getEwelinkAllDeviceList();
                return;
            }
            //重连超过5次失败，离线所有websocket设备
            //Reconnection fails more than 5 times, all websocket devices are offline
            const { count } = data.data;
            if (count === 5) {
                syncAllWebSocketDeviceOffline();
            }
        });
    }

    startReconnect(wsConfig: IWSConfig) {
        logger.info('wsConfig-------------------------',wsConfig)
        if (!this.isNeedReconnect()) {
            return;
        }

        logger.info(`wsRC -------------------- Reconnecting in ${this.reconnectTimeout / 1000} seconds...`);
        this.reconnectTimer = setTimeout(async () => {
            this.reconnectTimer = null;

            const res = await CoolKitWs.init(wsConfig);
            if (res.error === 0 && res.msg === 'success') {
                logger.info('wsRC --------------------reconnect success', res.error);
                this.stopReconnect();
                this.reconnectSuccess();
            }
            if (res.error === 605) {
                logger.info('wsRC --------------------reconnect fail, no internet');
                this.startReconnect(wsConfig);
            }
        }, this.reconnectTimeout);
        this.reconnectTimeout = Math.min(this.reconnectTimeout * this.maxBackoffFactor, this.maxReconnectTimeout);
    }

    // 停止重连
    stopReconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
            logger.info('wsRC --------------------reconnect stop');
        }
    }
}

export default new WsReconnectClass();
