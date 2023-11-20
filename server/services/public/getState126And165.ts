import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import mDnsDataParse from '../../utils/mDnsDataParse';
import updateLanDeviceData from './updateLanDeviceData';

/** uiid126 获取设备状态 (Get device status) */
export default async function getState126And165(deviceId: string) {
    try {
        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
        if (!eWeLinkDeviceData) {
            throw new Error('no eWeLinkDeviceData');
        }
        const { devicekey, apikey } = eWeLinkDeviceData.itemData;
        const stateRes = await updateLanDeviceData.getState(deviceId, devicekey, apikey);

        if (!stateRes || !stateRes.iv || !stateRes.data) {
            throw new Error();
        }

        const lanState = mDnsDataParse.decryptionData({ iv: mDnsDataParse.decryptionBase64(stateRes.iv), key: devicekey, data: stateRes.data });
        logger.info('lanState--------------------------------', lanState);
        return lanState;
    } catch (error: any) {
        logger.error('get 126 state  code error-----------------------------', deviceId, error);
        return null;
    }
}
