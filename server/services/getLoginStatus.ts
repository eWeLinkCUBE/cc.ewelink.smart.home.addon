import { Request, Response } from 'express';
import db from '../utils/db';
import { toResponse } from '../utils/error';
import logger from '../log';
import _ from 'lodash';

export default async function getLoginStatus(req: Request, res: Response) {
    try {
        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
        const autoSyncStatus = db.getDbValue('autoSyncStatus');
        //0 初始化的容器未登录(The initialized container is not logged in),
        //1 代表未登录(The representative is not logged in),
        //2 代表已登录(Representative is logged in)

        const support = db.getDbValue('support');

        const isFirstInit = db.getDbValue('isFirstInit');

        const result = {
            support
        }

        if (isFirstInit && !eWeLinkApiInfo) {
            db.setDbValue('isFirstInit', false);

            return res.json(
                toResponse(0, 'success', _.assign(result, {
                    loginStatus: 0,
                }))
            );
        }

        if (!eWeLinkApiInfo) {
            return res.json(
                toResponse(0, 'success', _.assign(result, {
                    loginStatus: 1,
                }))
            );
        }

        logger.info('get login status-----------------------is login', true);

        res.json(
            toResponse(0, 'success', _.assign(result, {
                loginStatus: 2,
                userInfo: {
                    account: eWeLinkApiInfo.userInfo.account,
                    autoSyncStatus: !!autoSyncStatus,
                },
                at: eWeLinkApiInfo.at,
            }))
        );
    } catch (error: any) {
        logger.error(`get login status error------------------------- ${error.message}`);
        res.json(toResponse(500));
    }
}
