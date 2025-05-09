import EUiid from '../ts/enum/EUiid';

//当前支持的全部uiid (All currently supported uiids)
export const SUPPORT_UIID_LIST = Object.values(EUiid).filter(value => typeof value === 'number');

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
    EUiid.uiid_1772,
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
    EUiid.uiid_28,
    EUiid.uiid_15,
    EUiid.uiid_2,
    EUiid.uiid_126,
    EUiid.uiid_3,
    EUiid.uiid_9,
    EUiid.uiid_138,
    EUiid.uiid_32,
    EUiid.uiid_165,
    EUiid.uiid_128,
    EUiid.uiid_130,
    EUiid.uiid_77,
    EUiid.uiid_133,
    EUiid.uiid_191,
    EUiid.uiid_162,
    EUiid.uiid_161,
    EUiid.uiid_160,
    EUiid.uiid_141,
    EUiid.uiid_103,
    EUiid.uiid_104,
    EUiid.uiid_136,
    EUiid.uiid_181,
    EUiid.uiid_182,
    EUiid.uiid_190
];

/** zigbee 五色灯设备 (zigbee five color lamp sub-device) */
export const ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST = [EUiid.uiid_3258, EUiid.uiid_7009];

/** zigbee 水浸传感器 (zigbee water immersion sensor) */
export const ZIGBEE_UIID_WATER_SENSOR = [EUiid.uiid_4026, EUiid.uiid_7019];

/** zigbee 温控阀 (zigbee trv) */
export const ZIGBEE_UIID_TRV_LIST = [EUiid.uiid_7017, EUiid.uiid_1772];