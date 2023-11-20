import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import addZigbeeSubDevice from './addZigbeeSubDevice';
import cancelSyncZigbeeDeviceToIHostBySse from './cancelSyncZigbeeDeviceToIHostBySse';

/**
 * 比较局域网获取的zigbeeP子设备列表和云端缓存的zigbeeP子设备列表，增加子设备或删除子设备或取消同步
 * Compare the zigbeeP sub-device list obtained from the LAN and the zigbeeP sub-device list cached in the cloud, add sub-devices or delete sub-devices or cancel synchronization
 */
export default async function diffZigbeeSubDeviceAndEWelinkDevice(zigbeePDeviceId: string, zigbeePSubDeviceList: string[]) {
    try {
        const eWeLinkZigbeePDeviceList = deviceDataUtil.getEWelinkZigbeeSubDeviceList(zigbeePDeviceId);

        if (!eWeLinkZigbeePDeviceList || !zigbeePSubDeviceList) {
            return;
        }

        zigbeePSubDeviceList.forEach((deviceId) => {
            if (!eWeLinkZigbeePDeviceList.includes(deviceId)) {
                addZigbeeSubDevice(zigbeePDeviceId, deviceId);
            }
        });

        eWeLinkZigbeePDeviceList.forEach((deviceId) => {
            if (!zigbeePSubDeviceList.includes(deviceId)) {
                cancelSyncZigbeeDeviceToIHostBySse(deviceId);
            }
        });
    } catch (error: any) {
        logger.error('diffZigbeeSubDeviceAndEWelinkDevice code error---------------------', error);
        return null;
    }
}
