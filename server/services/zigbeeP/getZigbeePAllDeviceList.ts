import _ from 'lodash';
import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import updateLanDeviceData from '../public/updateLanDeviceData';
import mDnsDataParse from '../../utils/mDnsDataParse';

export default async function getZigbeePAllDeviceList(deviceId: string) {
    try {
        logger.info('to get zigbee-p all deviceList', deviceId);

        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);

        if (!eWeLinkDeviceData) {
            throw new Error('no this deviceId in eWeLinkDeviceData');
        }

        const { devicekey, apikey } = eWeLinkDeviceData.itemData;

        let allZigbeePDevicesRes = await updateLanDeviceData.getAllDevices(deviceId, devicekey, apikey);

        //请求报错，重试一次
        if (!allZigbeePDevicesRes) {
            logger.info('request zigbeeP error,try request again---');
            await sleep(3);
            allZigbeePDevicesRes = await updateLanDeviceData.getAllDevices(deviceId, devicekey, apikey);
        }

        if (!allZigbeePDevicesRes || !allZigbeePDevicesRes.iv || !allZigbeePDevicesRes.data) {
            throw new Error('allZigbeePDevicesRes error');
        }

        const allZigbeeDevices = mDnsDataParse.decryptionData({ iv: mDnsDataParse.decryptionBase64(allZigbeePDevicesRes.iv), key: devicekey, data: allZigbeePDevicesRes.data });

        // logger.info('allZigbeeDevices----------------------', JSON.stringify(allZigbeeDevices, null, 2));
        return allZigbeeDevices as { deviceid: string; online: boolean; params: any }[];
    } catch (error: any) {
        logger.error('get zigbee-p all devices error---------------------------', error);
        return null;
    }
}

function sleep(second: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, second * 1000);
    });
}
