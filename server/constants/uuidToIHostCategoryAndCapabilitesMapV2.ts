import ECapability from '../ts/enum/ECapability';
import ECategory from '../ts/enum/ECategory';
import EPermission from '../ts/enum/EPermission';
import EUiid from '../ts/enum/EUiid';
import EProductMode7016 from '../ts/enum/EProductMode7016';
import ICoolkitDeviceProfiles from '../ts/interface/ICoolkitDeviceProfiles';
import { ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST, ZIGBEE_UIID_WATER_SENSOR, ZIGBEE_UIID_TRV_LIST } from './uiid'

const coolkitDeviceProfiles: ICoolkitDeviceProfiles[] = [
    //开关插座类 (Switch and socket)
    {
        uiidList: [
            EUiid.uiid_1,
            EUiid.uiid_6,
            EUiid.uiid_77,
            EUiid.uiid_14,
            EUiid.uiid_138,
            EUiid.uiid_160,
            EUiid.uiid_32,
            EUiid.uiid_209,
            EUiid.uiid_191,
            EUiid.uiid_1256,
            EUiid.uiid_7004,
            EUiid.uiid_7010,
        ],
        category: ECategory.SWITCH,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED }],
    },
    {
        uiidList: [EUiid.uiid_2, EUiid.uiid_7, EUiid.uiid_133, EUiid.uiid_161, EUiid.uiid_139, EUiid.uiid_210, EUiid.uiid_2256, EUiid.uiid_7011],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
        ],
    },
    {
        uiidList: [EUiid.uiid_3, EUiid.uiid_8, EUiid.uiid_162, EUiid.uiid_140, EUiid.uiid_211, EUiid.uiid_3256, EUiid.uiid_7012],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '3' },
        ],
    },
    {
        uiidList: [EUiid.uiid_4, EUiid.uiid_9, EUiid.uiid_141, EUiid.uiid_212, EUiid.uiid_4256, EUiid.uiid_7013],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '3' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '4' },
        ],
    },
    {
        uiidList: [EUiid.uiid_7021],
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
        ],
    },
    {
        uiidList: [EUiid.uiid_7022],
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '3' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1009, EUiid.uiid_7005, EUiid.uiid_7020],
        category: ECategory.PLUG,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED }],
    },
    {
        uiidList: [EUiid.uiid_190],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.VOLTAGE, permission: EPermission.UPDATED },
            {
                capability: ECapability.ELECTRIC_CURRENT,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.UPDATED,
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_182],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.VOLTAGE, permission: EPermission.UPDATED },
            {
                capability: ECapability.ELECTRIC_CURRENT,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.UPDATED,
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_44, EUiid.uiid_57],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.BRIGHTNESS,
                permission: EPermission.UPDATE_UPDATED,
                settings: {
                    range: { // 若该设置不存在，默认为0-100的百分比
                        permission: "01",
                        type: "numeric",
                        min: 0,
                        max: 100,
                        step: 1 // 步长
                    }
                }
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_103, EUiid.uiid_135, EUiid.uiid_52],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.BRIGHTNESS,
                permission: EPermission.UPDATE_UPDATED,
                settings: {
                    range: { // 若该设置不存在，默认为0-100的百分比
                        permission: "01",
                        type: "numeric",
                        min: 0,
                        max: 100,
                        step: 1 // 步长
                    }
                }
            },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_104, EUiid.uiid_136],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.BRIGHTNESS,
                permission: EPermission.UPDATE_UPDATED,
                settings: {
                    range: { // 若该设置不存在，默认为0-100的百分比
                        permission: "01",
                        type: "numeric",
                        min: 0,
                        max: 100,
                        step: 1 // 步长
                    }
                }
            },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_181, EUiid.uiid_15],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.TEMPERATURE,
                permission: EPermission.UPDATED_CONFIGURE,
                settings: {
                    temperatureRange: { // 温度检测范围
                        type: "numeric",
                        permission: "01",
                        min: -40, // 最小值，可选
                        max: 80, // 最大值，可选
                    },
                }
            },
            {
                capability: ECapability.HUMIDITY,
                permission: EPermission.UPDATED,
                settings: {
                    humidityRange: {
                        type: "numeric",
                        permission: "01",
                        min: 0,
                        max: 100
                    },
                }
            },
            { capability: ECapability.MODE, permission: EPermission.UPDATE_UPDATED, name: 'thermostatMode' },
        ],
    },
    {
        uiidList: [EUiid.uiid_34],
        category: ECategory.FAN_LIGHT,
        capabilities: [
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.MODE, permission: EPermission.UPDATE_UPDATED, name: 'fanLevel' },
        ],
    },
    {
        uiidList: [EUiid.uiid_7006, EUiid.uiid_7015, EUiid.uiid_11],
        category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.PERCENTAGE,
                permission: EPermission.UPDATE_UPDATED,
                settings: {
                    percentageRange: {
                        permission: "01",
                        type: "numeric",
                        min: 0,
                        max: 100,
                        step: 5
                    }
                }
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_1000, EUiid.uiid_7000, EUiid.uiid_1001],
        category: ECategory.BUTTON,
        capabilities: [{ capability: ECapability.PRESS, permission: EPermission.UPDATED }],
    },
    {
        uiidList: [EUiid.uiid_1002],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1003],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '3' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1004],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '4' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1005],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '5' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1006],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '5' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '6' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1770, EUiid.uiid_7014],
        category: ECategory.TEMPERATURE_AND_HUMIDITY_SENSOR,
        capabilities: [
            { capability: ECapability.TEMPERATURE, permission: EPermission.UPDATED_CONFIGURE },
            { capability: ECapability.HUMIDITY, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_2026],
        category: ECategory.MOTION_SENSOR,
        capabilities: [{ capability: ECapability.MOTION, permission: EPermission.UPDATED }],
    },
    {
        uiidList: [EUiid.uiid_7002],
        category: ECategory.MOTION_SENSOR,
        capabilities: [
            { capability: ECapability.MOTION, permission: EPermission.UPDATED },
            { capability: ECapability.ILLUMINATION_LEVEL, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_3026],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [{ capability: ECapability.CONTACT, permission: EPermission.UPDATED }],
    },
    {
        uiidList: [EUiid.uiid_5],
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED,
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_22],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_154],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.CONTACT, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
            {
                capability: ECapability.DETECT_HOLD,
                permission: EPermission.UPDATED,
                settings: {
                    detectHoldEnable: {	// 状态检测保持启用设置
                        permission: "01",
                        type: "boolean",
                        value: false,
                    },
                    detectHoldSwitch: {	// 状态检测保持动作设置
                        type: "enum",
                        permission: "01",
                        value: "on",
                        values: ["on", "off"]
                    },
                    detectHoldTime: { // 状态检测保持时间设置
                        type: "numeric",
                        permission: "01",
                        min: 1,
                        max: 359,
                        value: 5,
                        unit: "minute"
                    }
                }
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_102],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.CONTACT, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_36],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_173, EUiid.uiid_137],
        category: ECategory.LIGHT_STRIP,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.MODE,
                permission: EPermission.UPDATE_UPDATED,
                name: 'lightMode',
                settings: {
                    supportedValues: ['colorTemperature', 'color', 'whiteLight'],
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_59],
        category: ECategory.LIGHT_STRIP,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_7003],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.CONTACT, permission: EPermission.UPDATED },
            { capability: ECapability.TAMPER_ALERT, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_1257],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_1258, EUiid.uiid_7008],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST,
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    },
    {
        uiidList: ZIGBEE_UIID_WATER_SENSOR,
        category: ECategory.WATER_LEAK_DETECTOR,
        capabilities: [
            { capability: ECapability.WATER_LEAK, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_5026],
        category: ECategory.SMOKE_DETECTOR,
        capabilities: [
            { capability: ECapability.SMOKE, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: ZIGBEE_UIID_TRV_LIST,
        category: ECategory.THERMOSTAT,
        capabilities: [
            { capability: ECapability.VOLTAGE, permission: EPermission.UPDATED },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.UPDATE_UPDATED_CONFIGURE,
                name: 'manual-mode',
                settings: {
                    temperatureUnit: {
                        type: "enum",
                        permission: "11",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: 4,
                        max: 35,
                        step: 0.5
                    }
                },
            },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.UPDATE_UPDATED_CONFIGURE,
                name: 'eco-mode',
                settings: {
                    temperatureUnit: {
                        type: "enum",
                        permission: "11",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: 4,
                        max: 35,
                        step: 0.5
                    }
                },
            },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.UPDATED_CONFIGURE,
                name: 'auto-mode',
                settings: {
                    temperatureUnit: {
                        type: "enum",
                        permission: "11",
                        value: "c",
                        values: [
                            "c",
                            "f"
                        ]
                    },
                    temperatureRange: {
                        type: "numeric",
                        permission: "01",
                        min: 4,
                        max: 35,
                        step: 0.5
                    },
                    weeklySchedule: {
                        type: "object",
                        permission: "11",
                        value: {
                            maxEntryPerDay: 2,
                            Sunday: [],
                            Monday: [],
                            Tuesday: [],
                            Wednesday: [],
                            Thursday: [],
                            Friday: [],
                            Saturday: [],
                        }
                    },
                },
            },
            { capability: ECapability.THERMOSTAT, permission: EPermission.UPDATED, name: 'adaptive-recovery-status' },
            {
                capability: ECapability.THERMOSTAT,
                permission: EPermission.UPDATE_UPDATED,
                name: 'thermostat-mode',
                settings: {
                    supportedModes: {
                        type: "enum",
                        permission: "01",
                        values: [
                            "MANUAL",
                            "AUTO",
                            "ECO"
                        ]
                    }
                },
            },
            {
                capability: ECapability.TEMPERATURE,
                permission: EPermission.UPDATED_CONFIGURE,
                settings: {
                    temperatureCalibration: {
                        type: "numeric",
                        permission: "11",
                        min: -7, // 最小值，可选
                        max: 7, // 最大值，可选
                        step: 0.2, // 温度调节步长，单位同temperatureUnit
                        value: 5.2, // 表示当前温度校准值，number类型，单位同temperatureUnit，必选。
                    }
                },
            },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
        ],
    },
    {
        uiidList: [EUiid.uiid_130],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '3' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '4' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '4' },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED,
                name: '1',
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED,
                name: '2',
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED,
                name: '3',
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED,
                name: '4',
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                }
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '1',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '2',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '3',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '4',
            },
        ],
    },
];

const capabilityAndCategory126And165List = [
    {
        display_category: '',
        capabilities: [],
    },
    {
        display_category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
        ],
    },
    {
        display_category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.PERCENTAGE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
        ],
    },
];

const capabilityAndCategory7016 = {
    [EProductMode7016.EWELINK]: {
        display_category: ECategory.MOTION_SENSOR,
        capabilities: [{ capability: ECapability.MOTION, permission: EPermission.UPDATED }],
    },
    [EProductMode7016.SONOFF]: {
        display_category: ECategory.MOTION_SENSOR,
        capabilities: [
            { capability: ECapability.MOTION, permission: EPermission.UPDATED },
            {
                capability: ECapability.ILLUMINATION_LEVEL,
                permission: EPermission.UPDATED,
            },
        ],
    },
};

const uiidCapabilities = {
    coolkitDeviceProfiles, capabilityAndCategory126And165List, capabilityAndCategory7016
}

export default uiidCapabilities

