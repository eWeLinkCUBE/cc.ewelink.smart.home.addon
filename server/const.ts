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
        uiidList: [EUiid.uiid_1009, EUiid.uiid_7005],
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
        uiidList: [EUiid.uiid_44],
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.READ_WRITE },
        ],
    },
    {
        uiidList: [EUiid.uiid_103, EUiid.uiid_135],
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
        uiidList: [EUiid.uiid_181],
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.READ_WRITE },
            { capability: ECapability.TEMPERATURE, permission: EPermission.READ },
            { capability: ECapability.HUMIDITY, permission: EPermission.READ },
            { capability: ECapability.MODE, permission: EPermission.READ_WRITE, name: 'thermostatMode' },
        ],
    },
    {
        uiidList: [EUiid.uiid_15],
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
        uiidList: [EUiid.uiid_7006, EUiid.uiid_7015],
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
        uiidList: [EUiid.uiid_1000, EUiid.uiid_7000],
        category: ECategory.BUTTON,
        capabilities: [{ capability: ECapability.PRESS, permission: EPermission.READ }],
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
        uiidList: [EUiid.uiid_3026],
        category: ECategory.CONTACT_SENSOR,
        capabilities: [{ capability: ECapability.DETECT, permission: EPermission.READ }],
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
            { capability: ECapability.MOTOR_CLB, permission: EPermission.READ },
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
 * (The maximum and minimum values ​​corresponding to the temperature and humidity sensor probe)
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
