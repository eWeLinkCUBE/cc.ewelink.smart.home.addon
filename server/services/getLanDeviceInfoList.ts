import { Request, Response } from 'express';
import deviceMapUtil from '../utils/deviceMapUtil';
import { toResponse } from '../utils/error';
import _ from 'lodash';
import logger from '../log';
import generateDeviceInfoList from '../utils/generateDeviceInfoList';
import db from '../utils/db';
import { decode } from 'js-base64';
import getIHostSyncDeviceList from './public/getIHostSyncDeviceList';
import getEwelinkAllDeviceList from './public/getEwelinkAllDeviceList';
import { getUiidOperateInstance } from '../utils/deviceOperateInstanceMange';
import dayjs from 'dayjs';
import config from '../config';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import EUiid from '../ts/enum/EUiid';
import Uiid28 from './uiid/uiid28';

const { disappearTime } = config.timeConfig;

interface DeviceInfo {
    isOnline: boolean;
    isMyAccount: boolean;
    isSupported: boolean;
    displayCategory: string;
    familyName: string;
    deviceId: string;
    deviceName: string;
    isSynced: boolean;
}

/** 搜索局域网设备接口（登录后） (Search LAN device interface (after logging in))*/
export default async function getLanDeviceInfoList(req: Request, res: Response) {
    try {
        const { forceRefresh } = req.query;
        //1、查询mDns设备 (Query mdns device)
        let mDnsDeviceList = deviceMapUtil.getMDnsDeviceList();

        // if (mDnsDeviceList.length === 0) {
        //     logger.error('search lan device api (after login)-----no lan device------', mDnsDeviceList);
        //     return res.json(toResponse(0, 'not lan device', { deviceList: [] }));
        // }

        //2、查询eWeLink设备列表 (Query eWelink equipment column表)
        let eWeLinkDeviceList: any;
        if (forceRefresh === 'true') {
            logger.info('force refresh----');
            eWeLinkDeviceList = await getEwelinkAllDeviceList();
        } else {
            eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
        }

        if (!eWeLinkDeviceList) {
            throw new Error('no eEWeLinkDeviceList');
        }

        // 不在易微联账号下的设备且超过3分钟就消失
        // Devices that are not under an eWeLink account will disappear after more than 3 minutes.
        const nowTime = Date.now();
        mDnsDeviceList = mDnsDeviceList.filter((item) => {
            const isExistEWeLinkDevice = (eWeLinkDeviceList as IEWeLinkDevice[]).some((eItem) => eItem.itemData.deviceid === item.deviceId);
            if (isExistEWeLinkDevice) {
                return true;
            }

            const seconds = dayjs(nowTime).diff(dayjs(item.discoveryTime), 'seconds');

            if (seconds > disappearTime) {
                return false;
            }

            return true;
        });

        //3、查询下iHost已同步设备列表 (Query the list of devices synchronized by iHost)
        const iHostDeviceList = await getIHostSyncDeviceList();

        let syncedHostDeviceList = iHostDeviceList.map((item) => {
            if (!item.tags?.deviceInfo) return '';
            const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
            if (deviceInfo) {
                // TODO：The content in the judgment statement will be moved to the device operation class
                if (deviceInfo.uiid === EUiid.uiid_28) {
                    return deviceInfo.third_serial_number;
                }
                return deviceInfo.deviceId;
            }
            return '';
        });
        //只留下同步的设备 (Leave only synced devices)
        syncedHostDeviceList = syncedHostDeviceList.filter((item) => item !== '');

        logger.info('deviceList synced in iHost----', JSON.stringify(syncedHostDeviceList));

        const deviceList = generateDeviceInfoList(syncedHostDeviceList, mDnsDeviceList, eWeLinkDeviceList);
        if (forceRefresh === 'true') {
            judgeToSyncDeviceInfo(deviceList);
        }

        return res.json(toResponse(0, 'success', { deviceList }));
    } catch (error: any) {
        logger.error(`search lan device api (after login) code error----- ${error.message}`);
        res.json(toResponse(500));
    }
}

/** 判断是否要同步设备信息 (Determine whether to synchronize device information)*/
function judgeToSyncDeviceInfo(deviceList: DeviceInfo[]) {
    deviceList.forEach(item => {
        if (item.isSynced) {
            const operateInstance = getUiidOperateInstance<Uiid28>(item.deviceId)
            operateInstance?.syncTagsToIHostAfterRefresh?.();
        }
    });
}
