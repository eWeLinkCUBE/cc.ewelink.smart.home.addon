import logger from '../../log';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';

/** 设备上下线状态上报 (Report device online and offline status)*/
export default async function syncDeviceOnlineIHost(deviceId: string, isOnline: boolean) {
    try {
        const operateInstance = getUiidOperateInstance(deviceId);
        await operateInstance?.syncDeviceOnlineToIHost(isOnline);
    } catch (error: any) {
        logger.error('sync device online or offline code error------------------------------------------------', error);
        return null;
    }
}
