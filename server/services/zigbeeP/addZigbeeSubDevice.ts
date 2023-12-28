import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import getEWeLinkDevice from '../public/getEWeLinkDevice';

/** 增加zigbee-p子设备到云端数据 */
export default async function addZigbeeSubDevice(zigbeePDeviceId: string, deviceId: string) {
    try {
        const zigbeeSubDeviceIdList = deviceDataUtil.getEWelinkZigbeeSubDeviceList(zigbeePDeviceId);
        if (!zigbeeSubDeviceIdList) {
            logger.info('no zigbeeSubDeviceIdList--');
            return;
        }
        if (!zigbeeSubDeviceIdList.includes(deviceId)) {
            logger.info('to add subDevice to eweLink device data------ ');
            logger.info('get eWelink device----------', deviceId);

            getEWeLinkDevice(deviceId);
            getEWeLinkDevice(zigbeePDeviceId);
        }
    } catch (error) {
        logger.error('addZigbeeSubDevice code error-------', deviceId, error);
        return null;
    }
}
