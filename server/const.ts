import ECapability from './ts/enum/ECapability';
import ECategory from './ts/enum/ECategory';
import EPermission from './ts/enum/EPermission';
import EProductMode7016 from './ts/enum/EProductMode7016';
import EUiid from './ts/enum/EUiid';

interface ICoolkitDeviceProfiles {
    uiidList: EUiid[];
    category: ECategory;
    capabilities: {
        capability: ECapability;
        permission: EPermission;
        name?: string;
        configuration?: any;
    }[];
}

//当前支持的全部uiid (All currently supported uiids)
export const SUPPORT_UIID_LIST = Object.values(EUiid);

//支持单通道协议的uiid (Support uiid for single channel protocol)
export const SINGLE_PROTOCOL_LIST = [
    EUiid.uiid_1,
    EUiid.uiid_6,
    EUiid.uiid_32,
    EUiid.uiid_44,
    EUiid.uiid_103,
    EUiid.uiid_104,
    EUiid.uiid_135,
    EUiid.uiid_136,
    EUiid.uiid_14,
    EUiid.uiid_181,
    EUiid.uiid_15,
    EUiid.uiid_1256,
    EUiid.uiid_7004,
    EUiid.uiid_7010,
    EUiid.uiid_1009,
    EUiid.uiid_7005,
    EUiid.uiid_5,
    EUiid.uiid_36,
    EUiid.uiid_173,
    EUiid.uiid_59,
    EUiid.uiid_137,
    EUiid.uiid_7020,
];

//支持多通道协议的uiid (Support uiid for multi-channel protocols)
export const MULTI_PROTOCOL_LIST = [
    EUiid.uiid_2,
    EUiid.uiid_3,
    EUiid.uiid_4,
    EUiid.uiid_7,
    EUiid.uiid_8,
    EUiid.uiid_9,
    EUiid.uiid_133,
    EUiid.uiid_161,
    EUiid.uiid_162,
    EUiid.uiid_141,
    EUiid.uiid_140,
    EUiid.uiid_139,
    EUiid.uiid_210,
    EUiid.uiid_211,
    EUiid.uiid_212,
    EUiid.uiid_126,
    EUiid.uiid_165,
    EUiid.uiid_34,
    EUiid.uiid_2256,
    EUiid.uiid_7011,
    EUiid.uiid_3256,
    EUiid.uiid_7012,
    EUiid.uiid_4256,
    EUiid.uiid_7013,
    EUiid.uiid_130,
    EUiid.uiid_7021,
    EUiid.uiid_7022,
];

//单通道使用多通道协议的uiid (Single channel uses the uiid of the multi-channel protocol)
export const SINGLE_MULTI_PROTOCOL_LIST = [EUiid.uiid_77, EUiid.uiid_138, EUiid.uiid_160, EUiid.uiid_190, EUiid.uiid_182, EUiid.uiid_209, EUiid.uiid_191];

/** zigbee设备 (zigbee sub-device) */
export const ZIGBEE_UIID_DEVICE_LIST = [
    EUiid.uiid_168,
    EUiid.uiid_1256,
    EUiid.uiid_7004,
    EUiid.uiid_7010,
    EUiid.uiid_2256,
    EUiid.uiid_7011,
    EUiid.uiid_3256,
    EUiid.uiid_7012,
    EUiid.uiid_4256,
    EUiid.uiid_7013,
    EUiid.uiid_1009,
    EUiid.uiid_7005,
    EUiid.uiid_7006,
    EUiid.uiid_7015,
    EUiid.uiid_1000,
    EUiid.uiid_7000,
    EUiid.uiid_1770,
    EUiid.uiid_7014,
    EUiid.uiid_2026,
    EUiid.uiid_7016,
    EUiid.uiid_3026,
    EUiid.uiid_7002,
    EUiid.uiid_7003,
    EUiid.uiid_3258,
    EUiid.uiid_7009,
    EUiid.uiid_1258,
    EUiid.uiid_7008,
    EUiid.uiid_1257,
    EUiid.uiid_4026,
    EUiid.uiid_7019,
    EUiid.uiid_5026,
    EUiid.uiid_7017,
    EUiid.uiid_7020,
    EUiid.uiid_7021,
    EUiid.uiid_7022,
    EUiid.uiid_1001,
    EUiid.uiid_1002,
    EUiid.uiid_1003,
    EUiid.uiid_1004,
    EUiid.uiid_1005,
    EUiid.uiid_1006,
];

/** zigbee 窗帘子设备 (zigbee curtain sub-device) */
export const ZIGBEE_UIID_CURTAIN_LIST = [EUiid.uiid_7006, EUiid.uiid_7015];

export const WEB_SOCKET_UIID_DEVICE_LIST = [
    EUiid.uiid_5,
    EUiid.uiid_22,
    EUiid.uiid_36,
    EUiid.uiid_59,
    EUiid.uiid_102,
    EUiid.uiid_137,
    EUiid.uiid_154,
    EUiid.uiid_173,
    EUiid.uiid_52,
    EUiid.uiid_57,
    EUiid.uiid_11,
    EUiid.uiid_128,
    EUiid.uiid_130,
    EUiid.uiid_243,
];

/** 支持局域网和 websocket的设备 (Devices supporting LAN and websocket) */
export const LAN_WEB_SOCKET_UIID_DEVICE_LIST = [
    EUiid.uiid_1,
    EUiid.uiid_6,
    EUiid.uiid_14,
    EUiid.uiid_4,
    EUiid.uiid_8,
    EUiid.uiid_7,
    // EUiid.uiid_28,
    EUiid.uiid_15,
    EUiid.uiid_2,
    EUiid.uiid_126,
    EUiid.uiid_3,
    EUiid.uiid_9,
    EUiid.uiid_138,
    EUiid.uiid_32,
    EUiid.uiid_165,
];
/** zigbee 五色灯设备 (zigbee five color lamp sub-device) */
export const ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST = [EUiid.uiid_3258, EUiid.uiid_7009];

/** zigbee 水浸传感器 (zigbee water immersion sensor) */
export const ZIGBEE_UIID_WATER_SENSOR = [EUiid.uiid_4026, EUiid.uiid_7019];

/** zigbee 温控阀 (zigbee trv) */
export const ZIGBEE_UIID_TRV_LIST = [EUiid.uiid_7017, EUiid.uiid_1772];

export const coolkitDeviceProfiles: ICoolkitDeviceProfiles[] = [
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
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.READ_WRITE }],
    },
    {
        uiidList: [EUiid.uiid_2, EUiid.uiid_7, EUiid.uiid_133, EUiid.uiid_161, EUiid.uiid_139, EUiid.uiid_210, EUiid.uiid_2256, EUiid.uiid_7011],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
        ],
    },
    {
        uiidList: [EUiid.uiid_3, EUiid.uiid_8, EUiid.uiid_162, EUiid.uiid_140, EUiid.uiid_211, EUiid.uiid_3256, EUiid.uiid_7012],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '3' },
        ],
    },
    {
        uiidList: [EUiid.uiid_4, EUiid.uiid_9, EUiid.uiid_141, EUiid.uiid_212, EUiid.uiid_4256, EUiid.uiid_7013],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '3' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '4' },
        ],
    },
    {
        uiidList: [EUiid.uiid_7021],
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
        ],
    },
    {
        uiidList: [EUiid.uiid_7022],
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '3' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1009, EUiid.uiid_7005, EUiid.uiid_7020],
        category: ECategory.PLUG,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.READ_WRITE }],
    },
    {
        uiidList: [EUiid.uiid_190],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.READ,
            },
            { capability: ECapability.VOLTAGE, permission: EPermission.READ },
            {
                capability: ECapability.ELECTRIC_CURRENT,
                permission: EPermission.READ,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.READ,
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. The value range is greater than or equal to 3600, that is, more than 1 hour。
                    resolution: 3600,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: true,
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_182],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.READ,
            },
            { capability: ECapability.VOLTAGE, permission: EPermission.READ },
            {
                capability: ECapability.ELECTRIC_CURRENT,
                permission: EPermission.READ,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.READ,
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. value范围 大于等于3600，即1小时以上。
                    resolution: 3600 * 24,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: true,
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_44, EUiid.uiid_57],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_103, EUiid.uiid_135, EUiid.uiid_52],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_104, EUiid.uiid_136],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_RGB, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_181, EUiid.uiid_15],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TEMPERATURE, permission: EPermission.READ },
            { capability: ECapability.HUMIDITY, permission: EPermission.READ },
            { capability: ECapability.MODE, permission: EPermission.READ_WRITE, name: 'thermostatMode' },
        ],
    },
    {
        uiidList: [EUiid.uiid_34],
        category: ECategory.FAN_LIGHT,
        capabilities: [
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
            { capability: ECapability.MODE, permission: EPermission.READ_WRITE, name: 'fanLevel' },
        ],
    },
    {
        uiidList: [EUiid.uiid_7006, EUiid.uiid_7015, EUiid.uiid_11],
        category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.READ,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.READ_WRITE },
            { capability: ECapability.PERCENTAGE, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_1000, EUiid.uiid_7000, EUiid.uiid_1001],
        category: ECategory.BUTTON,
        capabilities: [{ capability: ECapability.PRESS, permission: EPermission.READ }],
    },
    {
        uiidList: [EUiid.uiid_1002],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '2' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1003],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '3' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1004],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '4' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1005],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '4' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '5' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1006],
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '4' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '5' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.READ, name: '6' },
        ],
    },
    {
        uiidList: [EUiid.uiid_1770, EUiid.uiid_7014],
        category: ECategory.TEMPERATURE_AND_HUMIDITY_SENSOR,
        capabilities: [
            { capability: ECapability.TEMPERATURE, permission: EPermission.READ },
            { capability: ECapability.HUMIDITY, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_2026],
        category: ECategory.MOTION_SENSOR,
        capabilities: [{ capability: ECapability.DETECT, permission: EPermission.READ }],
    },
    {
        uiidList: [EUiid.uiid_7002],
        category: ECategory.MOTION_SENSOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            { capability: ECapability.ILLUMINATION_LEVEL, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_3026],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [{ capability: ECapability.DETECT, permission: EPermission.READ }],
    },
    {
        uiidList: [EUiid.uiid_5],
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.READ,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.READ_WRITE,
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. value范围 大于等于3600，即1小时以上。
                    resolution: 3600 * 24,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: false,
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_22],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_RGB, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_154],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            { capability: ECapability.BATTERY, permission: EPermission.READ },
            { capability: ECapability.RSSI, permission: EPermission.READ },
            { capability: ECapability.DETECT_HOLD, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_102],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            { capability: ECapability.BATTERY, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_36],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_173, EUiid.uiid_137],
        category: ECategory.LIGHT_STRIP,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_RGB, permission: EPermission.READ_WRITE },
            {
                capability: ECapability.MODE,
                permission: EPermission.READ_WRITE,
                name: 'lightMode',
                configuration: {
                    supportedValues: ['colorTemperature', 'color', 'whiteLight'],
                },
            },
        ],
    },
    {
        uiidList: [EUiid.uiid_59],
        category: ECategory.LIGHT_STRIP,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_RGB, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_7003],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            { capability: ECapability.TAMPER_ALERT, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_1257],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_1258, EUiid.uiid_7008],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST,
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.READ_WRITE },
            { capability: ECapability.COLOR_RGB, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: ZIGBEE_UIID_WATER_SENSOR,
        category: ECategory.WATER_LEAK_DETECTOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            { capability: ECapability.BATTERY, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_5026],
        category: ECategory.SMOKE_DETECTOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            { capability: ECapability.BATTERY, permission: EPermission.READ },
        ],
    },
    {
        uiidList: ZIGBEE_UIID_TRV_LIST,
        category: ECategory.THERMOSTAT,
        capabilities: [
            { capability: ECapability.VOLTAGE, permission: EPermission.READ },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.READ_WRITE,
                name: 'manual-mode',
                configuration: {
                    temperature: {
                        min: 4,
                        max: 35,
                        increment: 0.5,
                        scale: 'c',
                    },
                    mappingMode: 'MANUAL',
                },
            },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.READ_WRITE,
                name: 'eco-mode',
                configuration: {
                    temperature: {
                        min: 4,
                        max: 35,
                        increment: 0.5,
                        scale: 'c',
                    },
                    mappingMode: 'ECO',
                },
            },
            {
                capability: ECapability.THERMOSTAT_TARGET_SETPOINT,
                permission: EPermission.READ,
                name: 'auto-mode',
                configuration: {
                    temperature: {
                        min: 4,
                        max: 35,
                        increment: 0.5,
                        scale: 'c',
                    },
                    mappingMode: 'AUTO',
                    weeklySchedule: {
                        maxEntryPerDay: 6,
                        Sunday: [],
                        Monday: [],
                        Tuesday: [],
                        Wednesday: [],
                        Thursday: [],
                        Friday: [],
                        Saturday: [],
                    },
                },
            },
            { capability: ECapability.THERMOSTAT, permission: EPermission.READ, name: 'adaptive-recovery-status' },
            {
                capability: ECapability.THERMOSTAT,
                permission: EPermission.READ_WRITE,
                name: 'thermostat-mode',
                configuration: {
                    supportedModes: ['MANUAL', 'AUTO', 'ECO'],
                },
            },
            {
                capability: ECapability.TEMPERATURE,
                permission: EPermission.READ_WRITE,
                configuration: {
                    range: {
                        min: -40,
                        max: 80,
                    },
                    scale: 'c',
                    calibration: {
                        min: -7,
                        max: 7,
                        increment: 0.2,
                        value: 0,
                    },
                },
            },
            { capability: ECapability.RSSI, permission: EPermission.READ },
        ],
    },
    {
        uiidList: [EUiid.uiid_130],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '3' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '4' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.READ, name: '1' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.READ, name: '2' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.READ, name: '3' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.READ, name: '4' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.READ, name: '1' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.READ, name: '2' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.READ, name: '3' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.READ, name: '4' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.READ, name: '1' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.READ, name: '2' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.READ, name: '3' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.READ, name: '4' },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.READ_WRITE,
                name: '1',
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. The value range is greater than or equal to 3600, that is, more than 1 hour。
                    resolution: 3600 * 24,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: false,
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.READ_WRITE,
                name: '2',
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. The value range is greater than or equal to 3600, that is, more than 1 hour。
                    resolution: 3600 * 24,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: false,
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.READ_WRITE,
                name: '3',
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. The value range is greater than or equal to 3600, that is, more than 1 hour。
                    resolution: 3600 * 24,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: false,
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.READ_WRITE,
                name: '4',
                configuration: {
                    // 统计电量时间间隔，单位是秒，number类型，必填。取值范围 大于等于3600，即1小时以上。
                    // Time interval for counting power, unit is second, type number, required. The value range is greater than or equal to 3600, that is, more than 1 hour。
                    resolution: 3600 * 24,
                    // 电量统计的时区偏移量，number 类型，必填。取值范围为 [-12.0 ~ 14.0] 。
                    // Time zone offset of power statistics, number type, required. The value range is [-12.0 ~ 14.0].
                    timeZoneOffset: 0,
                    // 仅支持查询，不更新状态，boolean类型，必填。暂时仅支持true。
                    // Only supports query, does not update status, boolean type, required. Currently only true is supported.
                    queryCommandOnly: false,
                },
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.READ_WRITE,
                name: '1',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.READ_WRITE,
                name: '2',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.READ_WRITE,
                name: '3',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.READ_WRITE,
                name: '4',
            },
        ],
    },
];

export const capabilityAndCategory126And165List = [
    {
        display_category: '',
        capabilities: [],
    },
    {
        display_category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.READ_WRITE, name: '2' },
            { capability: ECapability.RSSI, permission: EPermission.READ },
        ],
    },
    {
        display_category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.READ,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.READ_WRITE },
            { capability: ECapability.PERCENTAGE, permission: EPermission.READ_WRITE },
            { capability: ECapability.RSSI, permission: EPermission.READ },
        ],
    },
];

export const capabilityAndCategory7016 = {
    [EProductMode7016.EWELINK]: {
        display_category: ECategory.MOTION_SENSOR,
        capabilities: [{ capability: ECapability.DETECT, permission: EPermission.READ }],
    },
    [EProductMode7016.SONOFF]: {
        display_category: ECategory.MOTION_SENSOR,
        capabilities: [
            { capability: ECapability.DETECT, permission: EPermission.READ },
            {
                capability: ECapability.ILLUMINATION_LEVEL,
                permission: EPermission.READ,
            },
        ],
    },
};

/** 温湿度传感器探头对应的最大最小值
 * (The maximum and minimum values corresponding to the temperature and humidity sensor probe)
 * */
export const sensorTypeObj = {
    DHT11: {
        humRange: {
            min: 20,
            max: 90,
        },
        temRange: {
            min: 0,
            max: 50,
        },
    },
    DS18B20: {
        humRange: null,
        temRange: {
            min: -55,
            max: 125,
        },
    },
    AM2301: {
        humRange: {
            min: 0,
            max: 100,
        },
        temRange: {
            min: -40,
            max: 80,
        },
    },
    Si702: {
        humRange: {
            min: 0,
            max: 100,
        },
        temRange: {
            min: -40,
            max: 80,
        },
    },
    MS01: {
        humRange: {
            min: 0,
            max: 100,
        },
        temRange: null,
    },
    WTS01: {
        humRange: null,
        temRange: {
            min: -55,
            max: 125,
        },
    },
    errorType: {
        humRange: null,
        temRange: null,
    },
};

/**
 * uiid 59 灯带色温映射表
 * uiid 59 light strip color temperature mapping table
 */
export const fakeTempList = [
    '214,225,255',
    '214,225,255',
    '217,225,255',
    '215,226,255',
    '218,226,255',
    '216,227,255',
    '219,226,255',
    '217,227,255',
    '220,227,255',
    '218,228,255',
    '221,228,255',
    '220,229,255',
    '223,229,255',
    '221,230,255',
    '224,230,255',
    '222,230,255',
    '225,231,255',
    '224,231,255',
    '227,232,255',
    '225,232,255',
    '228,233,255',
    '227,233,255',
    '229,233,255',
    '228,234,255',
    '231,234,255',
    '230,235,255',
    '233,236,255',
    '231,236,255',
    '234,237,255',
    '233,237,255',
    '236,238,255',
    '235,238,255',
    '238,239,255',
    '237,239,255',
    '239,240,255',
    '239,240,255',
    '241,241,255',
    '240,241,255',
    '243,243,255',
    '243,242,255',
    '245,244,255',
    '245,243,255',
    '247,245,255',
    '247,245,255',
    '250,247,255',
    '249,246,255',
    '252,248,255',
    '252,247,255',
    '254,250,255',
    '254,249,255',
    '255,249,253',
    '255,249,253',
    '255,249,251',
    '255,248,251',
    '255,248,248',
    '255,246,248',
    '255,247,245',
    '255,245,245',
    '255,246,243',
    '255,244,242',
    '255,245,240',
    '255,243,239',
    '255,244,237',
    '255,242,236',
    '255,243,234',
    '255,240,233',
    '255,241,231',
    '255,239,230',
    '255,240,228',
    '255,238,227',
    '255,239,225',
    '255,236,224',
    '255,238,222',
    '255,235,220',
    '255,237,218',
    '255,233,217',
    '255,235,215',
    '255,232,213',
    '255,234,211',
    '255,230,210',
    '255,232,208',
    '255,228,206',
    '255,231,204',
    '255,227,202',
    '255,229,200',
    '255,225,198',
    '255,228,196',
    '255,223,194',
    '255,226,192',
    '255,221,190',
    '255,225,188',
    '255,219,186',
    '255,223,184',
    '255,217,182',
    '255,221,180',
    '255,215,177',
    '255,219,175',
    '255,213,173',
    '255,217,171',
    '255,211,168',
    '255,215,166',
    '255,209,163',
    '255,213,161',
    '255,206,159',
    '255,211,156',
    '255,204,153',
    '255,208,151',
    '255,201,148',
    '255,206,146',
    '255,199,143',
    '255,203,141',
    '255,196,137',
    '255,201,135',
    '255,193,132',
    '255,198,130',
    '255,190,126',
    '255,195,124',
    '255,187,120',
    '255,192,118',
    '255,184,114',
    '255,189,111',
    '255,180,107',
    '255,185,105',
    '255,177,101',
    '255,182,98',
    '255,173,94',
    '255,178,91',
    '255,169,87',
    '255,174,84',
    '255,165,79',
    '255,170,77',
    '255,161,72',
    '255,166,69',
    '255,157,63',
    '255,162,60',
    '255,152,54',
    '255,157,51',
    '255,147,44',
    '255,152,41',
    '255,142,33',
    '255,146,29',
    '255,137,18',
    '255,141,11',
];

/**
 * uiid 22 亮度档位(brightness gear)
 */
export const brightMap = ['25', '38', '40', '61', '85', '103', '117', '130', '141', '150', '159', '167', '174', '180', '186', '192', '197', '202', '207', '211', '255'];
