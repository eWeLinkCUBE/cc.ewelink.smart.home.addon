import db from './db';
import CkApi from '../lib/coolkit-api';
import config from '../config';
import _ from 'lodash';
import CoolKitWs from '../lib/coolkit-ws';
import type IWSConfig from '../ts/interface/IWSConfig';
import wsService from '../services/webSocket/wsService';
import logger from '../log';
import getEwelinkAllDeviceList from '../services/public/getEwelinkAllDeviceList';
import syncAllWebSocketDeviceOffline from '../services/webSocket/syncAllWebSocketDeviceOffline';
import WsReconnect from '../utils/wsReconnectClass';

export const initCoolkitApi = () => {
    // 初始化 coolkit api (Initialize coolkit api)
    //记住登录状态，防止重启后端服务后得重新登录 (Remember the login status to prevent having to log in again after restarting the backend service)
    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');

    const initParams = {
        appId: config.coolKit.appId,
        appSecret: config.coolKit.appSecret,
        timeout: 30000,
    };

    if (eWeLinkApiInfo) {
        _.merge(initParams, eWeLinkApiInfo);
    }

    CkApi.init(initParams);
};

export const initCoolkitWs = async () => {
    try {
        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');

        logger.info('ws--------------------', CoolKitWs.isWsExist());

        if (CoolKitWs.isWsExist()) {
            return {
                error: 0,
                msg: '',
            };
        }

        if (!eWeLinkApiInfo) {
            throw new Error('no login for websocket');
        }

        if (!eWeLinkApiInfo.user) {
            db.setDbValue('eWeLinkApiInfo', null);
            throw new Error('no login user info------,quit login');
        }

        const { region, at, user } = eWeLinkApiInfo;

        const wsConfig: IWSConfig = {
            userAgent: 'pc_ewelink',
            appid: config.coolKit.appId,
            at,
            apikey: user.apikey,
            region,
            maxRetry: 99,
            /**
             * 最大重试总时间，以秒为单位，默认为2小时，传入10分钟
             * Maximum total retry time, in seconds, defaults to 2 hours, enter 10 minutes
             */
            maxRetryInterval: 10 * 60,
            debug: true,
        };
        logger.info('ws--------------start');

        WsReconnect.stopReconnect();
        const res = await CoolKitWs.init(wsConfig);
        logger.info('ws res-------------------', res);

        if (res.error === 605) {
            logger.info('wsRC --------------------start reconnect');
            WsReconnect.startReconnect(wsConfig);
        }

        if (res.error === 0 && res.msg === 'success') {
            logger.info('ws connection success ------------');
            getEwelinkAllDeviceList();
        }
        CoolKitWs.on('message', (ev) => wsService.listenWs(ev));
        CoolKitWs.on('reconnect', (data) => {
            logger.info('reconnect----------------init', data);
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

        return res;
    } catch (error) {
        logger.error('websocket error: ' + error);
        return {
            error: 1,
            msg: 'initCoolkitWs code error',
        };
    }
};
