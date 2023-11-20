import { NextFunction, Request, Response } from 'express';
import logger from '../log';
import _ from 'lodash';

export default (req: Request, res: Response, next: NextFunction) => {
    logger.info('==================request info begin===================');
    const { params, body, method, url, query } = req;
    logger.info(`incoming request info: ${method} ${url}`);

    // 不打印用户信息 (Do not print user information)
    if (method === 'POST' && url.includes('account')) {
        return next();
    }

    if (!_.isEmpty(params)) {
        logger.info(`incoming request params: ${JSON.stringify(params)}`);
    }
    if (!_.isEmpty(body)) {
        logger.info(`incoming request body: ${JSON.stringify(body)}`);
    }
    if (!_.isEmpty(query)) {
        logger.info(`incoming request query: ${JSON.stringify(query)}`);
    }

    next();
};
