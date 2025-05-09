import { Request, Response } from 'express';
import { getPermissionApi } from '../api/iHost';
import db from '../utils/db';
import { toResponse } from '../utils/error';
import logger from '../log';
import config from '../config';
import Uiid130 from '../services/uiid/uiid130';

export default async function getPermission(req: Request, res: Response) {
    try {
        const iHostToken = db.getDbValue('iHostToken');
        if (iHostToken) {
            return res.json(toResponse(0));
        }
        const { error, message, data } = await getPermissionApi({ app_name: config.nodeApp.name });
        logger.info('get iHost token res-------------------------', error, message, data);

        if (data?.token) {
            db.setDbValue('iHostToken', data.token);
        }
        if ([400, 401].includes(error)) {
            logger.error('get iHost token has no auth------------------------', error);
            return res.json(toResponse(1100));
        }
        if (error === 0) {
            // 防止新安装的addon没触发更新tags（Prevent newly installed addon from triggering update tags）
            Uiid130.updateIHostTags()
        }

        logger.info('get iHost token------------------------------------------------', data);

        return res.json(toResponse(0, message));
    } catch (error: any) {
        logger.error(`get iHost token code error----------------: ${error.message}`);
        res.json(toResponse(500));
    }
}
