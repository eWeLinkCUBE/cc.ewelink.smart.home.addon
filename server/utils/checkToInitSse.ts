import logger from '../log';
import zigbeePSseMap from '../ts/class/zigbeePSseMap';
import EUiid from '../ts/enum/EUiid';
import deviceDataUtil from './deviceDataUtil';
import SSEClient from './sse';

/** 检查是否要建立zigbee-p的sse (Check whether to establish sse of zigbee p)*/
export default async function checkToInitSse(deviceId: string, ip: string) {
    if (zigbeePSseMap.zigbeePSsePoolMap.has(deviceId)) {
        return;
    }

    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);

    if (!eWeLinkDeviceData) return;

    const { devicekey } = eWeLinkDeviceData.itemData;
    const { uiid } = eWeLinkDeviceData.itemData.extra;
    if (uiid !== EUiid.uiid_168) {
        return;
    }
    logger.info('to set sse-----------------------');
    const sseClient = new SSEClient(ip, deviceId, devicekey);
    sseClient.connect();
}
