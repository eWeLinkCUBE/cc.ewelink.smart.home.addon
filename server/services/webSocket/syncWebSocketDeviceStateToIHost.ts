import logger from '../../log';
import _ from 'lodash';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';

// TODO: 此闭包变量需要放到 uiid130 的设备操作 class 中去定义
// const DELAY_TIME = 5000;
// const deviceParamsTimerObj: any = {};
// let tempParams: any = {};

export default async function syncWebSocketDeviceStateToIHost(deviceId: string, params: any) {
    try {
        logger.info('ws listen-------------------', deviceId, params);

        const operateInstance = getUiidOperateInstance(deviceId);
        await operateInstance?.syncDeviceStateToIHostByWebsocket(params);
    } catch (error: any) {
        logger.error('sync websocket device state to iHost-----------------------------', error);
        return null;
    }
}
