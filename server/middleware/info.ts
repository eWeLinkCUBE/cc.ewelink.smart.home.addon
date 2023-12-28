import { NextFunction, Request, Response } from 'express';
import logger from '../log';
import _ from 'lodash';
import config from '../config';
const isDev = config.nodeApp.env === 'dev';
const isPro = config.nodeApp.env === 'prod';

export default (req: Request, res: Response, next: NextFunction) => {
    logger.info('==================request info begin===================');

    const { params, body, method, url, query } = req;
    if (isPro) {
        logger.info(`incoming request info: ${method} ${url}`);
    }

    // 不打印用户信息 (Do not print user information)
    if (method === 'POST' && url.includes('account')) {
        return next();
    }

    if (!_.isEmpty(params)) {
        isPro && logger.info(`incoming request params: ${JSON.stringify(params)}`);
    }
    if (!_.isEmpty(body)) {
        if (isDev) {
            logger.info(`incoming request body: ${JSON.stringify(body, null, 2)}`);
        } else {
            logger.info(`incoming request body: ${JSON.stringify(body)}`);
        }
    }
    if (!_.isEmpty(query)) {
        isPro && logger.info(`incoming request query: ${JSON.stringify(query)}`);
    }

    next();
};
