import IEWeLinkDevice from "../ts/interface/IEWeLinkDevice";
import { toIntNumber } from "./tool";
import _ from 'lodash';

/** 
 * 把电压 0-3v 转换成电量百分比 0-100% 
 * voltage 为浮点数
 * batteryPercentage 为整数
 * Convert voltage 0-3v into battery percentage 0-100%
 * voltage is a floating point number
 * batteryPercentage is an integer
*/
export function changeVoltageToBattery(voltage: number, eWeLinkDeviceData: IEWeLinkDevice | null) {
    // 设备低电量电压值（Device low battery voltage value）
    const lowVolAlarm = _.get(eWeLinkDeviceData, 'itemData.devConfig.lowVolAlarm', 2.6)

    // 转换后的电量百分比（Converted battery percentage）
    let batteryPercentage = 100

    // ihost电量区间 0-19 低 ，20-69 中，70-100高（ihost power range 0-19 low, 20-69 medium, 70-100 high）
    const iHostLowVolAlarm = 20
    if (voltage >= lowVolAlarm) {
        batteryPercentage = iHostLowVolAlarm + (voltage - lowVolAlarm) / (3 - lowVolAlarm) * (100 - iHostLowVolAlarm)
    } else {
        batteryPercentage = iHostLowVolAlarm - (lowVolAlarm - voltage) / (lowVolAlarm - 0) * (iHostLowVolAlarm - 0)
    }

    return convertToRange(toIntNumber(batteryPercentage))
}

/** 
 * 取电量值，防止电压变化导致电量忽高忽低
 * 输入数字范围	返回值
 * Get the power value to prevent voltage changes from causing the power to go up and down.
 * Input numeric range return value
 * 0  - 20	 10
 * 21 - 40	 30
 * 41 - 60	 50
 * 61 - 80	 70
 * 81 - 100  90 
*/
function convertToRange(num: number): number {
    if (num === 0) {
        return 10
    }

    // Calculate the range
    return Math.ceil(num / 20) * 20 - 10;
}