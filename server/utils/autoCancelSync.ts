import db from './db';
import cancelSyncDeviceToIHost from '../services/public/cancelSyncDeviceToIHost';
import _ from 'lodash';
import logger from '../log';
import { decode } from 'js-base64';
import EUiid from '../ts/enum/EUiid';
import getAllRemoteDeviceList from './getAllRemoteDeviceList';
import { deleteDevice } from '../api/iHost';

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
            if (deviceInfo.uiid === EUiid.uiid_28) {
                const remoteDeviceList = getAllRemoteDeviceList(deviceInfo.deviceId);

                //每个遥控器都有id，才能去判断是否存在已被删除的遥控器（Each remote control has an ID, so we can determine whether there is a deleted remote control.）
                const isAllExistRemoteId = remoteDeviceList.every((it) => !!it?.smartHomeAddonRemoteId);
                if (!isAllExistRemoteId) {
                    logger.info('isAllExistRemoteId----------------', remoteDeviceList);
                    continue;
                }

                const isExist = remoteDeviceList.some((it) => it.smartHomeAddonRemoteId == deviceInfo.third_serial_number);
                if (!isExist) {
                    deleteDevice;
                    logger.info('auto cancel sync rf remote---------', remoteDeviceList, deviceInfo);
                    await deleteDevice(item.serial_number);
                }
            } else {
                // 当前账号下不存在该设备（该设备已被删除）
                // Does not exist under the current account（The device has been deleted）
                if (deviceInfo.account === account && !eWeLinkDeviceIdList.includes(deviceInfo.deviceId)) {
                    logger.info('account has this device ========', eWeLinkDeviceIdList.includes(deviceInfo.deviceId), account);
                    logger.info('auto cancel sync device to iHost------------', deviceInfo.deviceId);
                    await cancelSyncDeviceToIHost(deviceInfo.deviceId);
                }
            }
        }
    } catch (error: any) {
        logger.error('auto cancel sync code error---------------------', error);
    }
}
