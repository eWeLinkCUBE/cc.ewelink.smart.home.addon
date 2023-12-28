import type { IAfterLoginDevice } from '@/ts/interface/IDevice';
import { getAssetsFile } from '@/utils/tools';
import { EDisplayCategory } from '@/ts/enum/EDisplayCategory';

/**
 * 根据DeviceInfo获取设备卡片对应的图片
 * Obtain the picture corresponding to the device card according to device info片
 * @date 23/11/2022
 * @export
 * @param {IAfterLoginDevice} deviceInfo
 * @returns {*}
 */
export function getDeviceImg(deviceInfo: IAfterLoginDevice) {
    // 不区分设备在线/离线图标，设备离线时图标样式加上灰度滤镜（filter: grayscale(100%)）处理
    // The device online/offline icon is not distinguished. When the device is offline, the icon style is added with a grayscale filter (filter: grayscale(100%)).理
    switch (deviceInfo.displayCategory) {
        /** 开关插座 (switch socket) */
        case EDisplayCategory.SWITCH:
            return getAssetsFile('img/switch.png');
        /** 无线开关 (wireless switch)*/
        case EDisplayCategory.BUTTON:
            return getAssetsFile('img/button.png');
        /** 风扇灯 (fan light)*/
        case EDisplayCategory.FAN_LIGHT:
            return getAssetsFile('img/fanLight.png');
        /** 灯 (light)*/
        case EDisplayCategory.LIGHT:
            return getAssetsFile('img/light.png');
        /** RF */
        case EDisplayCategory.RF_GATEWAY:
        case EDisplayCategory.RF_REMOTE:
            return getAssetsFile('img/rf.png');
        /** curtains (curtains)*/
        case EDisplayCategory.CURTAIN:
            return getAssetsFile('img/curtain.png');
        /** 温湿度传感器 (Temperature and humidity sensor) */
        case EDisplayCategory.TEMPERATURE_AND_HUMIDITY_SENSOR:
            return getAssetsFile('img/temp-hum-sensor.png');
        /** 运动传感器 (motion sensor)*/
        case EDisplayCategory.MOTION_SENSOR:
            return getAssetsFile('img/motion-sensor.png');
        /** 人体存在传感器 (human presence sensor)*/
        case EDisplayCategory.PERSON_MOTION_SENSOR:
            return getAssetsFile('img/personMotionSensor.png');
        /** 门磁 (Door magnet)*/
        case EDisplayCategory.CONTACT_SENSOR:
            return getAssetsFile('img/door-sensor.png');
        /** Zigbee-P gateway */
        case EDisplayCategory.ZIGBEE_P:
            return getAssetsFile('img/zigbee-gateway.png');
        /** 灯带 (light strip) */
        case EDisplayCategory.LIGHT_STRIP:
            return getAssetsFile('img/light-strip.png');
        /** 温控阀 (thermostatic valve) */
        case EDisplayCategory.THERMOSTAT:
            return getAssetsFile('img/trv.png');
        /** 烟雾传感器 (smoke sensor) */
        case EDisplayCategory.SMOKE_DETECTOR:
            return getAssetsFile('img/smoke-sensor.png');
        /** 水浸传感器 (water immersion sensor) */
        case EDisplayCategory.WATER_LEAK_DETECTOR:
            return getAssetsFile('img/water-sensor.png');
        default:
            return getAssetsFile('img/switch.png');
    }
}
