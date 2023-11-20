import CkApi from './../../lib/coolkit-api';
import _ from 'lodash';
import IEWeLinkDevice from '../../ts/interface/IEWeLinkDevice';
import db from '../../utils/db';
import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';

export default async function getEWeLinkDevice(deviceId: string) {
    try {
        logger.info('to get one device', deviceId);

        //1、获取指定设备id的信息 (Get information about the specified device id)
        const res = await CkApi.device.getSpecThingList({ thingList: [{ id: deviceId }] });

        if (res.error !== 0) {
            logger.info('get eWeLinkDevice res -----------------------------', res);
            if (res.error === 401) {
                logger.info('account is login out----------------------------------');
                db.setDbValue('eWeLinkApiInfo', null);
            }
            return null;
        }

        const newEWeLinkDeviceData = res.data.thingList[0] as IEWeLinkDevice;

        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);

        //防止找不到新设备找不到家庭
        if (eWeLinkDeviceData) {
            logger.info('old familyName ----------');
            newEWeLinkDeviceData.familyName = eWeLinkDeviceData.familyName;
        } else {
            newEWeLinkDeviceData.familyName = ''; //给个默认值
        }

        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
        if (eWeLinkDeviceData) {
            _.remove(eWeLinkDeviceList, (item) => item.itemData.deviceid === deviceId);
        }

        eWeLinkDeviceList.push(newEWeLinkDeviceData);

        //存入数据库 (Save to database)
        db.setDbValue('eWeLinkDeviceList', eWeLinkDeviceList);

        return eWeLinkDeviceData;
    } catch (error: any) {
        logger.error('getEWeLinkDevice code error---------------------------', error);
        return null;
    }
}
