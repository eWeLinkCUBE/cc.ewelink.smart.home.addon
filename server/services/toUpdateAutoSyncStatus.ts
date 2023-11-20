import { Request, Response } from 'express';
import autoSyncRun from '../utils/autoSyncRun';
import db from '../utils/db';
import { toResponse } from '../utils/error';
import logger from '../log';

export default async function toUpdateAutoSyncStatus(req: Request, res: Response) {
    try {
        const { autoSyncStatus } = req.body;

        const iHostToken = db.getDbValue('iHostToken');

        if (!iHostToken) {
            return res.json(toResponse(1100));
        }

        db.setDbValue('autoSyncStatus', autoSyncStatus);

        if (autoSyncStatus) {
            autoSyncRun();
        }

        res.json(toResponse(0));
    } catch (error: any) {
        logger.error(`update auto sync device status code error------------------- ${error.message}`);
        res.json(toResponse(500));
    }
}
