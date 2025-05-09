import db from './db';
import _ from 'lodash';
import logger from '../log';
import { decode } from 'js-base64';
import { getUiidOperateInstance, deleteUiidOperateInstance } from './deviceOperateInstanceMange';

/**
 * 设备被删除，自动取消同步 (The device is deleted and synchronization is automatically cancelled.)
 */
export default async function () {
    try {
        const iHostDeviceList = db.getDbValue('iHostDeviceList');

        // 自动取消同步，条件：已同步的设备的被删除(已同步的iHost设备的account和当前的登录的account相同，易微联列表下没有该设备)
        // Automatically cancel synchronization, condition: the synchronized device is deleted (the account of the synchronized iHost device is the same as the current login account, and there is no such device in the eWeLink list)
        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');

        if (!eWeLinkApiInfo) {
            logger.error('no login ----------------- no cancel sync', eWeLinkApiInfo);
            return;
        }

        for (const item of iHostDeviceList) {
            if (!item.tags?.deviceInfo) continue;
            const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
            const operateInstance = getUiidOperateInstance(deviceInfo.deviceId);
            await operateInstance?.autoCancelSyncDeviceToIHost(deviceInfo, item.serial_number);
            // 取消同步后删除设备操作实例
            deleteUiidOperateInstance(deviceInfo.deviceId)
        }
    } catch (error: any) {
        logger.error('auto cancel sync code error---------------------', error);
    }
}
