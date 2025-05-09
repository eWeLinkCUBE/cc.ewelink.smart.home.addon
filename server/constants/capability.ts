import ECapability from "../ts/enum/ECapability"

/** 
 * 控制设备时短时间收到多次相同能力更改请求时需要收集在一起的能力
 * Requests that need to be collected together when receiving multiple requests for the same capability change in a short time. 
*/
export const needCollectCapabilities = [ECapability.BRIGHTNESS, ECapability.COLOR_TEMPERATURE, ECapability.COLOR_RGB, ECapability.TOGGLE, ECapability.MODE];

/** 
 * 获取易微联app设备数据,更新设备状态时需要屏蔽的一些支持场景触发条件的能力
 * Obtain the device data of Yiweilian app and update the device status and some capabilities that need to be blocked to support scene trigger conditions.
*/
export const skipTriggerCapsOnGetEWLDeviceList = [ECapability.PRESS, ECapability.MULTI_PRESS]

/**
 * 既支持长连接和局域网上报的设备在上报指定能力时，优先走局域网，指定能力如下
 * When reporting designated capabilities, devices that support long connections and local area networks are given priority. The designated capabilities are as follows
 */
export const lanPrioritizedCapabilities = [ECapability.TOGGLE_VOLTAGE, ECapability.TOGGLE_ELECTRIC_CURRENT, ECapability.TOGGLE_ELECTRIC_POWER, ECapability.ELECTRIC_POWER, ECapability.VOLTAGE, ECapability.ELECTRIC_CURRENT, ECapability.TEMPERATURE, ECapability.HUMIDITY]