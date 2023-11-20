import { NextFunction, Request, Response } from 'express';
import { toResponse } from '../utils/error';
import cancelSyncDeviceToIHost from './public/cancelSyncDeviceToIHost';
import _ from 'lodash';
import logger from '../log';
import getIHostSyncDeviceList from './public/getIHostSyncDeviceList';

/** 取消同步eWeLink设备到iHost(Unsynchronize eWelink device to iHost) */
export default async function toCancelDeviceToIHost(req: Request, res: Response, next: NextFunction) {
    try {
        const { deviceId } = req.params;

        const resData = await cancelSyncDeviceToIHost(deviceId);
        logger.info('cancel sync device to iHost res----------------------', resData);
        if (!resData) {
            throw new Error();
        }
        const { error, message, data } = resData;
        await getIHostSyncDeviceList();
        res.json(toResponse(error, message, data));
    } catch (error: any) {
        logger.error(`cancel sync device to iHost code error ------------------ ${error.message}`);
        res.json(toResponse(500));
    }
}
