import { Request, Response } from 'express';
import { toResponse } from '../utils/error';
import logger from '../log';
import toLogout from '../utils/toLogout';

export default async function logout(req: Request, res: Response) {
    try {
        toLogout()

        res.json(toResponse(0));
    } catch (error: any) {
        logger.error(`login out code error--------------------- ${error.message}`);
        res.json(toResponse(500));
    }
}
