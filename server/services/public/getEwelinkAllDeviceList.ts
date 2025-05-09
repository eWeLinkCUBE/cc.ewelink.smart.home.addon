import CkApi from './../../lib/coolkit-api';
import _ from 'lodash';
import IEWeLinkDevice from '../../ts/interface/IEWeLinkDevice';
import db from '../../utils/db';
import logger from '../../log';
import autoCancelSync from '../../utils/autoCancelSync';
import toUpdateEWeLinkDeviceTags from './toUpdateEWeLinkDeviceTags';
import { sleep } from '../../utils/timeUtils';
import EUiid from '../../ts/enum/EUiid';
import { get102DeviceOnline } from '../../utils/deviceUtil';
import syncAllWebSocketDeviceStateAndOnlineIHost from '../webSocket/syncAllWebSocketDeviceStateAndOnlineIHost';
import { initCoolkitWs } from '../../utils/initApi';
import Uiid130 from '../uiid/uiid130';

export default async function getEwelinkAllDeviceList() {
    try {
        logger.info('to get familyList');

        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
        if (!eWeLinkApiInfo) {
            logger.info('no login-----');
            return;
        }
        //1、获取家庭列表，得到家庭id和家庭名字 (1. Get the family list, get the family ID and family name)
        const res = await CkApi.family.getFamilyList({});

        if (res.error !== 0) {
            logger.info('get familyList res -----------------------------', res);
            if (res.error === 401) {
                logger.info('account is login out----------------------------------');
                db.setDbValue('eWeLinkApiInfo', null);
            }
            return null;
        }

        const originFamilyList = res.data.familyList.filter((item) => [1, 2].includes(item.familyType)); //自己的设备和别人分享的设备(Your own devices and devices shared by others)
        const familyList = originFamilyList.map((item) => {
            return {
                familyId: item.id,
                familyName: item.name,
            };
        });

        const familyObj: { [key: string]: string } = {};
        familyList.forEach((item) => {
            familyObj[item.familyId] = item.familyName;
        });

        //2、获取设备数据列表 (Get device data list)
        const toGetDeviceList = [];
        for (const family of familyList) {
            toGetDeviceList.push(getThreeTimesDeviceList(family.familyId));
            logger.info('get device by familyId params--------------------------------', { familyid: family.familyId, num: 0 });
        }
        const originDeviceResList = await Promise.all(toGetDeviceList);

        if (originDeviceResList.some((item) => item && item.error !== 0)) {
            logger.error('get device by familyId error--------------', originDeviceResList);
            return null;
        }
        let deviceList: IEWeLinkDevice[] = [];

        for (const res of originDeviceResList) {
            if (!res) {
                continue;
            }

            const { thingList } = res.data;
            if (!thingList) return;
            thingList.forEach((item) => {
                if ([1, 2].includes(item.itemType)) {
                    const { familyid } = item.itemData.family;
                    const device = _.cloneDeep(item) as IEWeLinkDevice;
                    device.familyName = familyObj[familyid];

                    deviceList.push(device);
                }
            });
        }

        deviceList = modifyDeviceOnlineStatus(deviceList);

        //存入数据库 (Save to database)
        db.setDbValue('eWeLinkDeviceList', deviceList);

        logger.info(
            'get all eWeLink deviceList--------------------------',
            deviceList.map((item) => {
                return { deviceId: item.itemData.deviceid, uiid: item.itemData.extra.uiid, online: item.itemData.online };
            })
        );

        syncAllWebSocketDeviceStateAndOnlineIHost();

        //刷新列表时检查websocket是否连接
        //Check if websocket is connected when refreshing list
        initCoolkitWs();

        logger.info('judge cancel sync device ----------------------------');

        //将每个rf网关的遥控器设置标识
        //Set the identification of the remote control of each rf gateway
        await toUpdateEWeLinkDeviceTags();
        // 修正tags中uiid130的devicekey（Correct the devicekey of uiid130 in tags）
        Uiid130.updateIHostTags()
        autoCancelSync();

        return deviceList;
    } catch (error: any) {
        logger.error('get eWeLink api code error---------------------------', error);
        return null;
    }
}

/** 三次获取家庭下的设备 (Get devices under home three times) */
async function getThreeTimesDeviceList(familyId: string) {
    let resData;
    for (const i of [1, 2, 3]) {
        // 第二次和第三次重试退避等待i秒 (Wait i seconds for the second and third retries to back off)
        if (i !== 1) await sleep(i * 1000);
        const res = await CkApi.device.getThingList({ familyid: familyId, num: 0 });
        logger.info('get family times-------------------------', i, familyId);
        resData = res;
        if (res.error === 0 && res.data.thingList.length > 0) {
            logger.info('get family api ok--------------');
            break;
        }
    }
    return resData;
}

function modifyDeviceOnlineStatus(eWeLinkDeviceList: IEWeLinkDevice[]) {
    const deviceList = eWeLinkDeviceList.map((item) => {
        const uiid = item.itemData.extra.uiid;
        // TODO：The content in the judgment statement will be moved to the device operation class
        if (uiid === EUiid.uiid_102) {
            item.itemData.online = get102DeviceOnline(item);
        }
        return item;
    });
    return deviceList;
}
