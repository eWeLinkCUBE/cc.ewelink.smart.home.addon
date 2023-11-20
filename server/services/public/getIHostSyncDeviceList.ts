import _ from 'lodash';
import { decode } from 'js-base64';
import { getIHostSyncDeviceList } from '../../api/iHost';
import db from '../../utils/db';
import logger from '../../log';

/** 获取iHost的eWeLink设备 (Get the eWelink device of iHost)*/
export default async function getIHostSyncedDeviceList() {
    try {
        const res = await getIHostSyncDeviceList();

        if (res.error !== 0 || !res.data) {
            logger.error('get iHost device res------------------------------', res);
            if ([400, 401].includes(res.error)) {
                logger.info('get iHost device fail,token invalid------------------------- clear');
                //iHostToken 失效，清空 (Invalidate, clear)
                db.setDbValue('iHostToken', '');
            }
            return [];
        }

        // 过滤掉iHost设备，只保留已同步的设备
        // Filter out iHost devices and keep only synchronized devices
        const iHostDeviceList = res.data.device_list.filter((item) => !item.protocol);

        db.setDbValue('iHostDeviceList', iHostDeviceList);

        return iHostDeviceList;
    } catch (error: any) {
        logger.error('get iHost device api code error-----------------------------------------', error);
        return [];
    }
}
