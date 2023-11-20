enum ELanType {
    /** 单通道 (single channel) */
    Plug = 'plug',
    /** 多通道 (multi-channel)*/
    Strip = 'strip',
    /** DualR3 */
    MultifunSwitch = 'multifun_switch',
    /** 温湿度开关 (Temperature and humidity switch)*/
    THPlug = 'th_plug',
    /** 功率检查插座 (Power check socket)*/
    EnhancedPlug = 'enhanced_plug',
    /** RF-Bridge */
    RF = 'rf',
    /** 风扇灯 (fan light)*/
    FanLight = 'fan_light',
    /** 灯球+灯泡 (Lamp ball + light bulb)*/
    Light = 'light',
}
export default ELanType;
