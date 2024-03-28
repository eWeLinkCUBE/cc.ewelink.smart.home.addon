import CoolKitWs from '../../lib/coolkit-ws';
import _ from 'lodash';
import logger from '../../log';
import syncDeviceOnlineIHost from '../../services/public/syncDeviceOnlineToIHost';
import syncWebSocketDeviceStateToIHost from './syncWebSocketDeviceStateToIHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import { initCoolkitWs } from '../../utils/initApi';
import syncDeviceCapabilitiesToIHost from '../public/syncDeviceCapabilitiesToIHost';
import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST } from '../../const';

async function updateByWs(param: { deviceid: string; ownerApikey: string; params: any }) {
    if (!CoolKitWs.isWsExist()) {
        const initRes = await initCoolkitWs();
        if (initRes && initRes.error !== 0) {
            return {
                error: 701,
                msg: 'Ws has been closed. Please try again.',
            };
        }
    }

    const { deviceid, ownerApikey, params } = param;
    // console.log(`SL : 更新设备信息`, deviceid, ownerApikey, params);
    logger.info('ws params-------',params)
    const updateResult = await CoolKitWs.updateThing({
        deviceid,
        ownerApikey,
        params,
    });
    // console.log(`SL : 长连接更新结果`, updateResult);
    if (updateResult.error !== 0) {
        logger.info('updateResult-------',params, updateResult);
        //{ error: 604, msg: '请求超时' }
        if (updateResult.error === 604) {
            initCoolkitWs();
        }
    }
    return updateResult;
}

async function listenWs(ev: { data: any; type: string; target: any }) {
    const { data } = ev;
    // 普通心跳，不做处理
    if (data === 'pong') {
        return;
    }

    const receiveMsg = JSON.parse(data);
    // 设备开关更新，发送监听消息(Device switch update, send monitoring message)
    if (_.has(receiveMsg, 'action')) {
        const { deviceid, action, params } = receiveMsg;
        const uiid = deviceDataUtil.getUiidByDeviceId(deviceid);

        // 只允许只支持websocket设备同步状态 Only supports websocket device synchronization status.
        if (![...WEB_SOCKET_UIID_DEVICE_LIST, ...LAN_WEB_SOCKET_UIID_DEVICE_LIST].includes(uiid)) {
            return;
        }

        switch (action) {
            case 'update':
                deviceDataUtil.updateEWeLinkDeviceData(deviceid, 'params', params);
                syncWebSocketDeviceStateToIHost(deviceid, params, uiid);
                syncDeviceCapabilitiesToIHost(deviceid, params);
                break;
            case 'sysmsg':
                logger.info('sysmsg-------------------', receiveMsg);
                syncDeviceOnlineIHost(deviceid, params.online);
                deviceDataUtil.updateEWeLinkDeviceData(deviceid, 'itemData', params);
                break;
        }
    }
}
//webSocket是否初始化了(Is the Web socket initialized??)
function isWsExist() {
    return CoolKitWs.isWsExist();
}

//webSocket是否连接着(Is webSocket connected?)
function isWsConnected() {
    return CoolKitWs.isWsConnected();
}

export default {
    updateByWs,
    listenWs,
    isWsExist,
    isWsConnected
};
