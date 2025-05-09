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

const capabilityAndCategory126And165List = [
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

const capabilityAndCategory7016 = {
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

const uuidToIHostCategoryAndCapabilitesMap = {
    coolkitDeviceProfiles, capabilityAndCategory126And165List, capabilityAndCategory7016
}

export default uuidToIHostCategoryAndCapabilitesMap;