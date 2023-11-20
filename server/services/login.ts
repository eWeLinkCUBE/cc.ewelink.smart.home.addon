import { Request, Response } from 'express';
import { toResponse } from '../utils/error';
import CkApi from '../lib/coolkit-api';
import logger from '../log';
import db from '../utils/db';
import config from '../config';
import getEwelinkAllDeviceList from './public/getEwelinkAllDeviceList';

export default async function login(req: Request, res: Response) {
    const { account } = req.params;
    const { countryCode, password } = req.body;
    const loginParams = {
        countryCode,
        password,
    };

    if (account.includes('@')) {
        // 使用邮箱登录 (Log in using email)
        Object.assign(loginParams, { email: account });
    } else {
        // 使用手机号登录 (Log in using mobile phone number)
        Object.assign(loginParams, { phoneNumber: `${countryCode}${account}` });
    }

    try {
        const { error, data, msg } = await CkApi.user.login(loginParams);
        const autoSyncStatus = db.getDbValue('autoSyncStatus');

        if (error !== 0 || !data) {
            //登录密码错误 (Wrong login password)
            if (error === 10001 || error === 10014) {
                return res.json(toResponse(1001, msg, data));
            }
            //帐号格式有误 (Account format is wrong)
            if (error === 400) {
                return res.json(toResponse(1002, msg, data));
            }
            //用户不存在 (User does not exist)
            if (error === 10003) {
                return res.json(toResponse(1003, msg, data));
            }

            return res.json(toResponse(error, msg, data));
        }

        const account = data.user.phoneNumber ? data.user.phoneNumber : data.user.email;
        if (!account) {
            throw new Error();
        }
        const userInfo = {
            account,
            autoSyncStatus,
        };

        db.setDbValue('eWeLinkApiInfo', {
            at: data.at,
            rt: data.rt,
            region: data.region,
            userInfo,
        });

        db.setDbValue('atUpdateTime', Date.now());

        // 重新初始化(Reinitialize) coolkit api
        CkApi.init({
            at: data?.at,
            rt: data?.rt,
            region: data?.region,
            appId: config.coolKit.appId,
            appSecret: config.coolKit.appSecret,
            useTestEnv: config.nodeApp.env === 'dev',
            timeout: 30000,
        });
        await getEwelinkAllDeviceList();
        logger.info('login request res------------------------------------------------', 'userInfo', userInfo, 'at', data.at);

        const response = {
            userInfo,
            at: data.at,
        };

        res.json(toResponse(error, msg, response));
    } catch (error: any) {
        // logger.error(`login request code error--------------------- ${error.message}`);
        res.json(toResponse(500));
    }
}
