import { Request, Response } from 'express';
import { toResponse } from '../utils/error';
import syncDeviceToIHost from './public/syncDeviceToIHost';
import logger from '../log';
import getIHostSyncDeviceList from './public/getIHostSyncDeviceList';
import db from '../utils/db';
import electricityDataUtil from '../utils/electricityDataUtil';
import _ from 'lodash';
import deviceDataUtil from '../utils/deviceDataUtil';
import EUiid from '../ts/enum/EUiid';
import syncRfDeviceToIHost from './rf/syncRfDeviceToIHost';

/** 同步eWeLink设备到iHost (Synchronize eWelink device to iHost)*/
export default async function toSyncDeviceToIHost(req: Request, res: Response) {
    try {
        const { deviceId } = req.params;
        let realDeviceId;

        if (deviceId.indexOf('_') > -1) {
            realDeviceId = deviceId.split('_')[0];
        } else {
            realDeviceId = deviceId;
        }

        const uiid = deviceDataUtil.getUiidByDeviceId(realDeviceId);
        let resData: any;

        if ([EUiid.uiid_28].includes(uiid)) {
            const remoteIndex = Number(deviceId.split('_')[1]);
            resData = await syncRfDeviceToIHost(realDeviceId, remoteIndex);
        } else {
            resData = await syncDeviceToIHost([realDeviceId]);
        }

        if (typeof resData === 'number') {
            return res.json(toResponse(resData));
        }
        if (!resData) {
            logger.error('sync device to iHost fail----------------------');
            return res.json(toResponse(500));
        }

        if (resData?.payload.description === 'headers.Authorization is invalid') {
            logger.info('sync iHost device,iHost token useless-------------------------clear');

            //iHostToken 失效，清空 (Invalidate, clear)
            db.setDbValue('iHostToken', '');
            return res.json(toResponse(1100));
        }

        if (resData?.payload.type === 'INVALID_PARAMETERS') {
            logger.error('sync device to iHost error params------------------', resData.payload);
            //参数错误 (Parameter error)
            return res.json(toResponse(500));
        }

        await getIHostSyncDeviceList();

        //清空电量缓存 (Clear battery cache)
        electricityDataUtil.clearDeviceCache(realDeviceId);

        res.json(toResponse(0));
    } catch (error: any) {
        logger.error('to sync device to iHost code error-----------------------------', error);
        res.json(toResponse(500));
    }
}
