enum ECapability {
    /** 电源通断状态 (Power on and off status)*/
    POWER = 'power',
    /** 表示无线信号强度 (Indicates wireless signal strength)*/
    RSSI = 'rssi',
    /** 固件升级 (Firmware upgrade)*/
    OTA = 'ota',
    /** 当前检测 (Current detection)*/
    DETECT = 'detect',
    /** 电池剩余电量 (Battery remaining power)*/
    BATTERY = 'battery',
    /** 开关能力 (switching ability)*/
    TOGGLE = 'toggle',
    /** (窗帘)某种程度的百分比 (Curtains to some extent percentage)*/
    PERCENTAGE = 'percentage',
    /** (窗帘)电机开合状态 (Curtain motor opening and closing status)*/
    MOTOR_CONTROL = 'motor-control',
    /** (窗帘)电机正反转设置  ( Curtain Motor forward and reverse settings)*/
    MOTOR_REVERSE = 'motor-reverse',
    /** 窗帘校准行程 (Curtain calibration stroke) */
    MOTOR_CLB = 'motor-clb',
    /** 温度  (temperature)*/
    TEMPERATURE = 'temperature',
    /** 相对湿度 (Relative humidity)*/
    HUMIDITY = 'humidity',
    /** 按键 (button)*/
    PRESS = 'press',
    /** 颜色 (color)*/
    COLOR_RGB = 'color-rgb',
    /** 色温 (color temperature)*/
    COLOR_TEMPERATURE = 'color-temperature',
    /** 亮度 (brightness)*/
    BRIGHTNESS = 'brightness',
    /** 摄像头视频流能力 (Camera video streaming capabilities)*/
    CAMERA_STREAM = 'camera-stream',
    /** 通电反应 (energization reaction)*/
    STARTUP = 'startup',
    /** 功能配置 (Function configuration)*/
    CONFIGURATION = 'configuration',
    /** 水分 (moisture)*/
    MOISTURE = 'moisture',
    /** 气压 (air pressure)*/
    BAROMETRIC_PRESSURE = 'barometric-pressure',
    /** 风速 (wind speed)*/
    WIND_SPEED = 'wind-speed',
    /** 风向 (wind direction)*/
    WIND_DIRECTION = 'wind-direction',
    /** 降水量 (precipitation)*/
    RAINFALL = 'rainfall',
    /** 光照度 (light illuminance)*/
    ILLUMINATION = 'illumination',
    /** 紫外线指数 (UV index)*/
    ULTRAVIOLET_INDEX = 'ultraviolet-index',
    /** 二氧化碳 (carbon dioxide)*/
    CO2 = 'co2',
    /** 电导率 (Conductivity)*/
    ELECTRICAL_CONDUCTIVITY = 'electrical-conductivity',
    /** 系统 (system)*/
    SYSTEM = 'system',
    /** 电量统计 (Power statistics)*/
    POWER_CONSUMPTION = 'power-consumption',
    /** 电压 (Voltage)*/
    VOLTAGE = 'voltage',
    /** 功率 (power)*/
    ELECTRIC_POWER = 'electric-power',
    /** 电流 (current)*/
    ELECTRIC_CURRENT = 'electric-current',
    /** 多通道按键 (Multi-channel buttons)*/
    MULTI_PRESS = 'multi-press',
    /** 风扇灯模式 (Fan light mode)*/
    MODE = 'mode',
    /** 温度模式感应  (Temperature pattern sensing)*/
    THERMOSTAT_MODE_DETECT = 'thermostat-mode-detect',
    /** 表示设备端主动上报识别结果 or 已激活 (Indicates that the device actively reports the recognition results or has been activated.) */
    IDENTIFY = 'identify',
    /** 明亮度等级，String类型，必选。可选参数，"brighter"（较亮）、"darker"（较暗）
     * (Brightness level, string type, required. Optional parameters, "brighter" (brighter), "darker" (darker))
     * */
    ILLUMINATION_LEVEL = 'illumination-level',
}

export default ECapability;
