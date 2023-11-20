import { Request, Response } from 'express';
import deviceMapUtil from '../utils/deviceMapUtil';
import { toResponse } from '../utils/error';
import dayjs from 'dayjs';
import logger from '../log';
import config from '../config';

const { disappearTime } = config.timeConfig;

/**
 * 搜索局域网设备接口（登录前）
 * Search LAN device interface (before logging in)
*/
export default async function getLanDeviceList(req: Request, res: Response) {
    try {
        //已搜索到的设备(Devices found)
        let mDnsDeviceList = deviceMapUtil.getMDnsDeviceList();
        if (!mDnsDeviceList) {
            logger.error('search lan device api (before login)------------can not get lan device---------------', mDnsDeviceList);
            throw new Error();
        }

        const nowTime = Date.now();
        //去掉一段时间扫描不到的设备(Remove devices that cannot be scanned for a period of time)
        mDnsDeviceList = mDnsDeviceList.filter((item) => {
            //设备发现时间和当前时间的间隔 (The interval between device discovery time and current time)
            const seconds = dayjs(nowTime).diff(dayjs(item.discoveryTime), 'seconds');

            return seconds <= disappearTime;
        });

        const deviceList = mDnsDeviceList.map((item) => {
            return {
                deviceId: item.deviceId,
                category: item.deviceData.type,
            };
        });

        logger.info('search lan (before login) device api response--------------------', deviceList);

        res.json(toResponse(0, 'success', { deviceList }));
    } catch (error: any) {
        logger.error('search lan device api (before login) code error---------------------', error);
        res.json(toResponse(500, JSON.stringify(error)));
    }
}
