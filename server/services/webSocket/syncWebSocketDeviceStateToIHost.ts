import logger from '../../log';
import _ from 'lodash';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';

export default async function syncWebSocketDeviceStateToIHost(deviceId: string, lanState: any) {
    try {
        logger.info('ws listen-------------------', deviceId, lanState);

        const operateInstance = getUiidOperateInstance(deviceId);
        await operateInstance?.syncDeviceStateToIHostByWebsocket({ lanState });
    } catch (error: any) {
        logger.error('sync websocket device state to iHost-----------------------------', error);
        return null;
    }
}
