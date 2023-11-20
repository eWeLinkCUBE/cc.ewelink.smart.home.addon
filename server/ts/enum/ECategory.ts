/** 设备类别 (Equipment category) */
enum ECategory {
    /** 未支持设备 (Device not supported)*/
    UNKNOWN = 'UNKNOWN',
    /* 插座 (socket)**/
    PLUG = 'plug',
    /* 开关 (switch)**/
    SWITCH = 'switch',
    /** 通用传感器（seeed） (Universal sensor (seeed)) */
    SENSOR = 'sensor',
    /* 窗帘 (curtain) **/
    CURTAIN = 'curtain',
    /* 灯 (light) **/
    LIGHT = 'light',
    /* 水浸 (Flooding) **/
    WATER_LEAK_DETECTOR = 'waterLeakDetector',
    /* 烟感 (Smoke sensation) **/
    SMOKE_DETECTOR = 'smokeDetector',
    /* 无线按钮 (wireless button) **/
    BUTTON = 'button',
    /* 温湿度传感器 (Temperature and humidity sensor)**/
    TEMPERATURE_AND_HUMIDITY_SENSOR = 'temperatureAndHumiditySensor',
    /* 温度传感器 (Temperature Sensor) **/
    TEMPERATURE_SENSOR = 'temperatureSensor',
    /* 湿度传感器 (Humidity Sensor)**/
    HUMIDITY_SENSOR = 'humiditySensor',
    /** 门磁 (Door magnet)*/
    CONTACT_SENSOR = 'contactSensor',
    /* 人体传感器 (human body sensor) **/
    MOTION_SENSOR = 'motionSensor',
    /* 摄像头 (Camera)**/
    CAMERA = 'camera',
    /** 风扇灯 (fan light)*/
    FAN_LIGHT = 'fanLight',
}

export default ECategory;
