import _ from 'lodash';
import logger from '../../log';
// import stateTransform from '../../utils/stateTransform';
import { getUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';
/** 设备状态上报  (Equipment status reporting)*/
export default async (deviceId: string) => {
    try {
        const operateInstance = getUiidOperateInstance(deviceId);
        operateInstance?.syncDeviceStateToIHostByLan();

        // 确认这个请求是成功的 (Confirm that the request was successful)
        // if (res && res.header && res.header.name === 'Response') {
        //     iHostDeviceMap.deviceMap.set(deviceId, { updateTime: nowTime, state });
        // }

        return null;
    } catch (error: any) {
        logger.error('sync device status code error--------------------------------', deviceId, error);
        return null;
    }
};