import CkApi from './../../lib/coolkit-api';
import _ from 'lodash';
import IEWeLinkDevice from '../../ts/interface/IEWeLinkDevice';
import db from '../../utils/db';
import logger from '../../log';
import autoCancelSync from '../../utils/autoCancelSync';

export default async function getEwelinkAllDeviceList() {
    try {
        logger.info('to get familyList');
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
        const deviceList: IEWeLinkDevice[] = [];

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
        //存入数据库 (Save to database)
        db.setDbValue('eWeLinkDeviceList', deviceList);

        logger.info(
            'get all eWeLink deviceList--------------------------',
            deviceList.map((item) => item.itemData.deviceid)
        );

        logger.info('judge cancel sync device ----------------------------');
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
        if (i !== 1) await sleep(i);
        const res = await CkApi.device.getThingList({ familyid: familyId, num: 0 });
        logger.info('get family times-------------------------', i, familyId);
        if (res.error === 0 && res.data.thingList.length > 0) {
            logger.info('get family api ok--------------');
            resData = res;
            break;
        }
    }
    return resData;
}

function sleep(second: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, second * 1000);
    });
}
