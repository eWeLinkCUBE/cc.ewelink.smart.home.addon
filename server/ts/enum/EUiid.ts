/**
 * 映射到云端设备的UIID
 * (Map to the uiid of the cloud device)
 */
enum EUiid {
    /** 单通道插座 (single channel socket)*/
    uiid_1 = 1,
    /** 双通道插座 (Dual channel socket)*/
    uiid_2 = 2,
    /** 三通道插座 (Three channel socket) */
    uiid_3 = 3,
    /** 四通道插座 (Four channel socket)*/
    uiid_4 = 4,
    /** 单通道开关 (single channel switch)*/
    uiid_6 = 6,
    /** 双通道开关 (Dual channel switch)*/
    uiid_7 = 7,
    /** 三通道开关 (Three channel switch)*/
    uiid_8 = 8,
    /** 四通道开关 (Four channel switch)*/
    uiid_9 = 9,
    /** 单通道开关 (single channel switch)*/
    uiid_14 = 14,
    /** UIID：32-功率检测插座过载告警 (32-Power detection socket overload alarm)*/
    uiid_32 = 32,
    /** 单通道插座-多通道版 (Single channel socket Multi-channel version )*/
    uiid_77 = 77,
    /** UIID：133 - HMI墙面开关(Hmi wall switch) */
    uiid_133 = 133,
    /** 单通道开关 (single channel switch) */
    uiid_138 = 138,
    /** 单通道开关 (single channel switch)*/
    uiid_160 = 160,
    /** POWS3-显示屏版本 (Display version)*/
    uiid_190 = 190,
    /** 双通道开关 -- 轻智能  (Dual channel switch --light intelligence)*/
    uiid_161 = 161,
    /** 三通道开关 -- 轻智能  (Three-channel switch --light intelligence)*/
    uiid_162 = 162,
    /** 单路调光灯 (Single channel dimming light)*/
    uiid_44 = 44,
    /** 功率检测插座过载告警 -- 多通道协议 (Power detection socket overload alarm --multi-channel protocol)*/
    uiid_182 = 182,
    /** 双色冷暖灯 (双色冷暖灯)*/
    uiid_103 = 103,
    /** UIID：104 - RGB五色灯_支持随调和场景 ( RGB five-color lights support adjusting scenes)*/
    uiid_104 = 104,
    /** 双通道开关  (Dual channel switch)*/
    uiid_139 = 139,
    /** 四通道开关 (Four channel switch)*/
    uiid_141 = 141,
    /** 三通道开关 (Three channel switch)*/
    uiid_140 = 140,
    /** 双色冷暖灯_支持2.4G轻智能 (Dual-color heating and cooling lamp supports 2.4g light intelligence)*/
    uiid_135 = 135,
    /** RGB五色灯_支持2.4G轻智能 (RGB five-color lamp supports 2.4g light intelligence)*/
    uiid_136 = 136,
    /** 单通道触摸开关 (Single channel touch switch)*/
    uiid_209 = 209,
    /** 双通道触摸开关 (Dual channel touch switch)*/
    uiid_210 = 210,
    /** 三通道触摸开关 (Three channel touch switch)*/
    uiid_211 = 211,
    /** 四通道触摸开关 (Four channel touch switch)*/
    uiid_212 = 212,
    /** 单通道插座  (single channel socket)*/
    uiid_191 = 191,
    /** 恒温恒湿改装件 (Constant temperature and humidity modification parts)*/
    uiid_181 = 181,
    /** 多功能双通道电量检测开关 (Multifunctional dual-channel power detection switch)*/
    uiid_126 = 126,
    /** 恒温恒湿改装件 (Constant temperature and humidity modification parts)*/
    uiid_15 = 15,
    /** iFan03智能风扇灯 (I fan03 smart fan light)*/
    uiid_34 = 34,
    /** dual r3 lite 多功能双通道开关_支持电机模式 (Multifunctional dual-channel switch supports motor mode)*/
    uiid_165 = 165,
    /** RFBridge */
    uiid_28 = 28,

    /** zigbee-p 网关,以下都是zigbee设备 (zigbee-p gateway, the following are zigbee devices)*/
    uiid_168 = 168,
    /** 单通道开关 (single channel switch)*/
    uiid_1256 = 1256,
    /** 单通道开关 (single channel switch)*/
    uiid_7004 = 7004,
    /** 单通道开关 (single channel switch)*/
    uiid_7010 = 7010,
    /** 双通道开关 (Dual channel switch)*/
    uiid_2256 = 2256,
    /** 双通道开关 (Dual channel switch) */
    uiid_7011 = 7011,
    /** 三通道开关 (Three channel switch)*/
    uiid_3256 = 3256,
    /** 三通道开关 (Three channel switch) */
    uiid_7012 = 7012,
    /** 四通道开关 (Four channel switch)*/
    uiid_4256 = 4256,
    /** 四通道开关 (Four channel switch)*/
    uiid_7013 = 7013,
    /** 单通道插座 (single channel socket)*/
    uiid_1009 = 1009,
    /** 单通道插座 (single channel socket)*/
    uiid_7005 = 7005,
    /** 窗帘 (curtain)*/
    uiid_7006 = 7006,
    /** 窗帘 (curtain)*/
    uiid_7015 = 7015,
    /** 人体存在传感器 (human presence sensor)*/
    uiid_7016 = 7016,
    /** 无线按键 (wireless button)*/
    uiid_1000 = 1000,
    /** 无线按键 (wireless button)*/
    uiid_7000 = 7000,
    /** 温湿度传感器 (Temperature and humidity sensor)*/
    uiid_1770 = 1770,
    /** 温湿度传感器 (Temperature and humidity sensor)*/
    uiid_7014 = 7014,
    /** 运动传感器 (motion sensor)*/
    uiid_2026 = 2026,
    /** 运动传感器 (motion sensor) */
    uiid_7002 = 7002,
    /** 门磁 (Door magnet)*/
    uiid_3026 = 3026,
    /** 门磁 (Door magnet)*/
    uiid_7003 = 7003,
    /** 烟感 (smoke sensor) */
    uiid_5026 = 5026,
    /** 水浸 (water immersion sensor) */
    uiid_4026 = 4026,
    /** 水浸 (water immersion sensor) */
    uiid_7019 = 7019,
    /** 单色灯 (Monochrome lamp) */
    uiid_1257 = 1257,
    /** 双色灯 (bicolor lamp) */
    uiid_1258 = 1258,
    /** 双色灯 (bicolor lamp) */
    uiid_7008 = 7008,
    /** 五色灯 (five color lamp) */
    uiid_3258 = 3258,
    /** 五色灯 (five color lamp) */
    uiid_7009 = 7009,
    /** 温控阀 (thermostat) */
    uiid_1772 = 1772,
    /** 温控阀 (thermostat) */
    uiid_7017 = 7017,

    /** 功率检测单通道插座 (Power detection single channel socket) */
    uiid_5 = 5,
    /** RGB五色球泡灯 (RGB five-color bulb) */
    uiid_22 = 22,
    /** 单路调光开关(single dimmer switch) */
    uiid_36 = 36,
    /** 律动灯带(Rhythm light strip) */
    uiid_59 = 59,
    /** WiFi门磁(Wi fi gate) */
    uiid_102 = 102,
    /** 律动灯带-蓝牙版(rhythm Light strip Bluetooth version) */
    uiid_137 = 137,
    /** 新版WIFI门磁（New version of wifi door sensor） */
    uiid_154 = 154,
    /** 幻彩灯带-Sonoff */
    uiid_173 = 173,
    /** 调光调色温吸顶灯 */
    uiid_52 = 52,
    /** 单色球泡灯 */
    uiid_57 = 57,
    /** 电动窗帘 */
    uiid_11 = 11,
    /** 堆叠式电表 */
    uiid_128 = 128,
    /** 堆叠式电表四通道开关子设备 */
    uiid_130 = 130,
}

export default EUiid;
