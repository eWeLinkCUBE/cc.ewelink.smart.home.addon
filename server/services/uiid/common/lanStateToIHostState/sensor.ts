import ECapability from '../../../../ts/enum/ECapability';
import IHostDeviceData from '../../../../ts/interface/IHostDeviceData';
import _ from 'lodash';

/**
 * 给定传感器的检测能力状态 (The detection capability status of a given sensor)
 * @param iHostDeviceData 同步到 iHost 的设备信息 (Device information synchronized to iHost)
 * @param value 设备能力状态的具体值 (Specific value of device capability status)
 * @param stateKeys 能力状态的 state 值 key 数组 (Ability state value key array)
 * @returns
 */
export function getSensorState(iHostDeviceData: IHostDeviceData | null, value: any, stateKeys: string[]) {
    // 判断设备能力中是否包括 detect
    const isSensorDetectIncluded = iHostDeviceData?.capabilityList?.find((capability) => capability === ECapability.DETECT);
    if (isSensorDetectIncluded) {
        return {
            detect: {
                detected: value,
            },
        };
    }

    return _.set({}, stateKeys, value);
}
