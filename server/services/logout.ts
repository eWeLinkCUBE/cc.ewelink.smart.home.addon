import { Request, Response } from 'express';
import db from '../utils/db';
import { toResponse } from '../utils/error';
import logger from '../log';
import syncAllWebSocketDeviceOffline from './webSocket/syncAllWebSocketDeviceOffline';
import CoolKitWs from '../lib/coolkit-ws';

export default async function logout(req: Request, res: Response) {
    try {
        logger.info('quit login------------------------------');

        //clear data
        db.setDbValue('eWeLinkApiInfo', null);
        db.setDbValue('autoSyncStatus', false);
        db.setDbValue('atUpdateTime', 0);
        db.setDbValue('eWeLinkDeviceList', []);
        //关闭websocket连接（Close websocket connection）
        logger.info('close websocket ------------');
        CoolKitWs.close();
        syncAllWebSocketDeviceOffline();

        res.json(toResponse(0));
    } catch (error: any) {
        logger.error(`login out code error--------------------- ${error.message}`);
        res.json(toResponse(500));
    }
}
