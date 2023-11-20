import db from './db';
import cancelSyncDeviceToIHost from '../services/public/cancelSyncDeviceToIHost';
import _ from 'lodash';
import logger from '../log';
import { decode } from 'js-base64';

/**
 * 设备被删除，自动取消同步 (The device is deleted and synchronization is automatically cancelled.)
 */
export default async function () {
    try {
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
        const iHostDeviceList = db.getDbValue('iHostDeviceList');

        // 自动取消同步，条件：已同步的设备的被删除(已同步的iHost设备的account和当前的登录的account相同，易微联列表下没有该设备)
        // Automatically cancel synchronization, condition: the synchronized device is deleted (the account of the synchronized iHost device is the same as the current login account, and there is no such device in the eWeLink list)
        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');

        if (!eWeLinkApiInfo) {
            logger.error('no login ----------------- no cancel sync', eWeLinkApiInfo);
            return;
        }

        const eWeLinkDeviceIdList = eWeLinkDeviceList.map((item) => item.itemData.deviceid);
        const account = eWeLinkApiInfo.userInfo.account;

        for (const item of iHostDeviceList) {
            if (!item.tags?.deviceInfo) continue;
            const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
            // 当前账号下不存在该设备（该设备已被删除）
            // Does not exist under the current account该设备（该设备已被删除）
            if (deviceInfo.account === account && !eWeLinkDeviceIdList.includes(deviceInfo.deviceId)) {
                logger.info('account has this device ================================', eWeLinkDeviceIdList.includes(deviceInfo.deviceId), account);
                logger.info('auto cancel sync device to iHost--------------------------------------------------------', deviceInfo.deviceId);
                logger.info('data db--------------------------------------------------------', db.getDb());
                await cancelSyncDeviceToIHost(deviceInfo.deviceId);
            }
        }
    } catch (error: any) {
        logger.error('auto cancel sync code error---------------------', error);
    }
}
