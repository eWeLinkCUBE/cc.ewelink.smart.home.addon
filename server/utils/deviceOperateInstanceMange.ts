import type BaseDeviceOperate from "../services/uiid/baseDeviceOperate";
import EUiid from "../ts/enum/EUiid";
import deviceDataUtil from "./deviceDataUtil";
import deviceUiidOperateClassMap from "../constants/deviceUiidOperateClassMap";
import _ from "lodash";

/** 
 * 设备操作实例管理
 * 只有需要进行设备相关操作（状态上报、待同步、设备控制）的设备才允许拥有“设备操作实例”
 * 取消同步的设备需要删除实例
*/
const deviceOperateInstanceMap = new Map<string, BaseDeviceOperate>();

function setUiidOperateInstance(deviceId: string) {
    const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);

    if (!uiid || !(uiid in EUiid)) {
        return;
    }
    const UiidOperateClass = _.get(deviceUiidOperateClassMap, uiid as EUiid, null);

    if (!UiidOperateClass?.uiid) return;
    const instance = new UiidOperateClass(deviceId);
    deviceOperateInstanceMap.set(deviceId, instance)
}

export function getUiidOperateInstance<T extends BaseDeviceOperate = BaseDeviceOperate>(deviceId: string) {
    if (!deviceOperateInstanceMap.has(deviceId)) {
        setUiidOperateInstance(deviceId);
    }
    return deviceOperateInstanceMap.get(deviceId) as T | undefined;
}

export function deleteUiidOperateInstance(deviceId: string) {
    deviceOperateInstanceMap.delete(deviceId);
}