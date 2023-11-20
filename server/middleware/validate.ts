import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { getErrorMsg } from '../utils/validate';

/** 参数错误校验 (Parameter error checking)*/
async function validate(req: Request, res: Response, next: NextFunction) {
    const error = getErrorMsg(req);
    if (error) return res.status(400).json(error);
    next();
}

export default validate;
