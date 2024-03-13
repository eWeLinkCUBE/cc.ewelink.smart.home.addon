type Switch = 'off' | 'on';
/** "brighter" - 较亮(brighter) "darker" - 较暗(darker) */
type BrState = 'darker' | 'brighter';
/** 温控阀工作模式 (TRV working mode) */
export enum TrvWorkMode {
    /** 手动模式 (manual mode) */
    MANUAL = 'MANUAL',
    /** 关闭-防霜冻模式 (eco mode) */
    ECO = 'ECO',
    /** 自动模式 (auto mode) */
    AUTO = 'AUTO',
}
/** 温控阀状态 (TRV work state) */
export enum TrvWorkState {
    /** 保温中 (inactive) */
    INACTIVE = 'INACTIVE',
    /** 加热中 (heating) */
    HEATING = 'HEATING',
}

/** 单通道开关或插座的局域网state数据 (LAN state data for a single channel switch or socket) */
export interface ILanStateSingleSwitch {
    switch: Switch;
}
//多通道里的通道数据 (Channel data in multi-channel)
export interface ILanStateSwitch {
    switch: Switch;
    outlet: number;
}

/** 多通道开关或插座的局域网state数据 (LAN state data for multi-channel switches or sockets)*/
export interface ILanStateMultipleSwitch {
    switches: ILanStateSwitch[];
}

export interface ILanState190 {
    switches: { switch: Switch; outlet: 0 }[];
    /**
     * 电流(current)
     * Number	必选(required)	[0,2000]
     * 单位: 0.01A
     */
    current: number;
    /**
     * 电压(Voltage)
     * Number	必选(required)	[0, 26400]
     * 单位(unit): 0.01V
     */
    voltage: number;
    /**
     * 功率(power)
     * Number	必选(required)	[10, 500000]
     * 单位(unit): 0.01W
     */
    power: number;
    /**
     * 今日用电量(Amount of electricity for today)
     * Number	必选(required)
     * 单位(unit)0.01kwh
     */
    dayKwh: number;
    /**
     * 本月用电量(Amount of electricity for today)
     * Number	必选(required)
     * 单位(unit)0.01kwh
     */
    monthKwh: number;
}

export interface ILanStateLight {
    switch?: 'on';
    /** 情景模式(Scenario) */
    ltype: 'white' | 'bright' | 'read' | 'nightLight' | 'color';
    white?: {
        /** [1, 100] */
        br: number;
        /** [0, 100] */
        ct: number;
    };
    color?: {
        br: number;
        r: number;
        g: number;
        b: number;
    };
    bright?: { br: number; ct: number };
    read?: { br: number; ct: number };
    nightLight?: { br: number; ct: number };
    computer?: { br: number; ct: number };
    fwVersion?: string;
}

export interface ILanState44 {
    brightness: number;
    switch: Switch;
}

export interface ILanState181and15 {
    switch: Switch;
    /** 其中 0 表示单位为摄氏度，1 表示单位为华氏度。(Where 0 means the unit is Celsius and 1 means the unit is Fahrenheit) */
    tempUnit: 0 | 1;
    timeZone: number;
    /** 表示传感器类型。(Indicates sensor type) */
    sensorType: 'DS18B20' | 'AM2301' | 'MS01' | 'WTS01' | 'errorType';
    /** 表示当前传感器采集到的温度值。取值范围是 [-99.9, 127.0] ，保留一位小数，字符串形式。 (Keep one decimal place, string form) */
    currentTemperature: string;
    /** 表示当前传感器采集到的湿度值。取值范围是 [0.0, 100.0] ，保留一位小数，字符串形式。 (Keep one decimal place, string form) */
    currentHumidity: string;
    /** 温度校准值 (temperature calibration value) */
    tempCorrection: number;
    /** 湿度校准值  (Humidity calibration value) */
    humCorrection: number;
    /**
     * uiid 181 私有字段 (uiid 181 private field)
     * 表示启用/禁用自动控制模式。其中 0 表示禁用自动控制模式，1 表示启用自动控制模式。
     * (Indicates enabling/disabling automatic control mode. Where 0 means disabling automatic control mode, 1 means enabling automatic control mode)
     */
    autoControlEnabled: 0 | 1;
    /**
     * uiid 15 私有字段 (uiid 15 private field)
     * deviceType模式 --- temperature温度控制，humidity湿度控制，normal正常，即手动控制开关状态
     * (deviceType mode ---temperature temperature control, humidity control, normal, that is, manual control switch status)
     */
    deviceType: 'temperature' | 'humidity' | 'normal';
}

export interface ILanState126And165 {
    /**
     * 工作模式：1 普通开关 2 电机模式 3电表模式,不支持3电表模式
     * Working mode: 1 ordinary switch 2 motor mode 3 meter mode, 3 meter mode is not supported式
     *  */
    workMode: 1 | 2 | 3;
    switches?: { switch: Switch; outlet: 0 }[];
    /**
     * 上线的时候或者操作的的时候上报当前的轨道位置百分比
     * Report the current track position percentage when going online or during operation.
     * */
    currLocation?: number;
    /**
     * [0,1,2] 马达动作类型：0  表示停止； 1 表示开启（正转）；2 表示关闭（反转）
     * [0,1,2] Motor action type: 0 means stop; 1 means open (forward rotation); 2 means closed (reverse rotation)
     *  */
    motorTurn?: 0 | 1 | 2;
    /**
     * 电机目标位置， Number型。取值[0,100]
     * Motor target position, Number type. Value[0,100]
     *  */
    location?: number;
    /**
     * 轨道校准状态：0  未校准；1  已校准
     * Track calibration status: 0 not calibrated; 1 calibrated
     * */
    calibState?: 0 | 1;
}

export interface ILanState34 {
    light: Switch;
    fan: Switch;
    /**
     * 1 表示低档，2 表示中档，3 表示高档
     * 1 means low range, 2 means mid-range, 3 means high-end
     * */
    speed: 1 | 2 | 3;
}
//rfChl0~rfChl63
export interface ILanState28 {
    [rfTrig: string]: string; //2023-05-16T13:15:50.000Z
}
/** 无线按键 (wireless button) */
export interface ILanStateButton {
    /** 0: 单击(click)   1:双击(double click)  2 长按 (0 click, 1 double click 2 long press) */
    key?: 0 | 1 | 2;
    /** 0-100代表电量分比 (0-100 Represents the power ratio) */
    battery?: number;
}
/** 门窗传感器 (door and window sensor) */
export interface ILanStateContactSensor {
    /** 0-100代表电量分比 (0 100 represents the power ratio) */
    battery?: number;
    /**
     * 表⽰⻔窗的开关状态，Number型。取值范围[0,1]，0关⻔，1开⻔
     * Indicates the opening and closing status of the door and window, number type. Value range [0,1], 0 closes the door, 1 opens the door
     */
    lock?: 0 | 1;
}

/** 7003门磁-带防拆能力 (7003 door magnet with anti-tamper capability) */
export interface ILanStateContactSensorWithTamperAlert extends ILanStateContactSensor {
    /** 0: 未被拆除，1：被拆除 */
    split: 0 | 1;
}
/** 窗帘 (curtain)*/
export interface ILanStateCurtain {
    /** 设备开百分比上报 (Device open percentage reporting) */
    curPercent?: number;
    /** "normal"：正常模式(已校准)(Normal mode (calibrated))   "calibration"： 正在校准(Calibrating) */
    motorClb?: string;
}
/** 温湿度传感器 (Temperature and humidity sensor) */
export interface ILanStateTemAndHum {
    /** 单位摄氏度。数值=实际温度值x100 (Units are Celsius. Value = actual temperature value x100) */
    temperature: string;
    /** 数值=实际湿度值x100 (Value = actual humidity value x100) */
    humidity: string;
    /** [0,100] */
    battery: number;
}
/** 运动传感器 2026/7002 (motion sensor) */
export interface ILanStateMotionSensor {
    /** 移动事件，Number型。取值范围[0,1]，0⽆⼈，1有⼈ (Movement event, number type. Value range [0,1], 0 is empty, 1 is occupied) */
    motion: 0 | 1;
    /** 电池电量百分⽐，Number型。取值范围[0,100] (Battery power percentage, number type. Value range[0,100]) */
    battery: number;
}
export interface ILanStateMotionSensor7002 extends ILanStateMotionSensor {
    /** "brighter" - 较亮(brighter) "darker" - 较暗(darker) */
    brState: BrState;
}
/** 7016 */
export interface ILanStatePersonExist {
    /** 0 - 无人状态(Unmanned state) 1 - 有人状态(Someone's status) */
    human: 0 | 1;
    /** "brighter" - 较亮(brighter) "darker" - 较暗(darker) */
    brState: BrState;
}

/** 单色灯 (monochrome lamp) */
export interface ILanStateMonochromeLamp {
    switch: Switch;
    /** 亮度百分比，取值范围[1 ~ 100] (brightness value range [1 ~ 100]) */
    brightness: number;
}

/** 双色灯 (bicolor lamp) */
export interface ILanStateBicolorLamp {
    switch: Switch;
    /** 亮度百分比，取值范围[1 ~ 100] (brightness value range [1 ~ 100]) */
    brightness: number;
    /** 色温百分比，取值范围[1 ~ 100] (colorTemp value range [1 ~ 100]) */
    colorTemp: number;
}

/** 五色灯 (five color lamp) */
export interface ILanStateFiveColorLamp {
    switch: Switch;
    /** cct: 白光模式，rgb: 彩光模式 */
    colorMode: 'cct' | 'rgb';
    /** 白光模式下的亮度百分比，取值范围[1 ~ 100] */
    cctBrightness: number;
    /** 彩光模式下的亮度百分比，取值范围[1 ~ 100] */
    rgbBrightness: number;
    /** 色温百分比，取值范围[0 ~ 100] (colorTemp value range [1 ~ 100]) */
    colorTemp: number;
    /** 色相，取值范围[0 ~ 359] */
    hue: number;
    /** 饱和度，取值范围[0 ~ 100] */
    saturation: number;
}

/** 水浸传感器 (水浸传感器) */
export interface ILanStateWaterSensor {
    /** 电池电量百分⽐，Number型。取值范围[0,100] (Battery power percentage, number type. Value range[0,100]) */
    battery: number;
    /** 0: 无水，1：水浸 (0: No water, 1: Flooded) */
    water: 0 | 1;
}

/** 烟雾传感器 (smoke sensor) */
export interface ILanStateSmokeDetector {
    /** 电池电量百分⽐，Number型。取值范围[0,100] (Battery power percentage, number type. Value range[0,100]) */
    battery: number;
    /** 0：无烟，1：有烟 (0: No smoke, 1: Smoke) */
    smoke: 0 | 1;
    /** 触发时间 (Trigger time) */
    trigTime: string;
}

/** 温控阀 (thermostatic valve) */
export interface ILanStateTrv {
    /** 电量 (battery) */
    battery: number;
    /** 当前的目标温度 (target temperature) */
    curTargetTemp: number;
    /** 手动模式下目标温度 (Target temperature in manual mode) */
    manTargetTemp: number;
    /** 自动模式下目标温度 (Target temperature in auto mode) */
    autoTargetTemp: number;
    /** 节能模式下目标温度 (Target temperature in eco mode) */
    ecoTargetTemp: number;
    /** 当前温度 (temperature) */
    temperature: number;
    /** 温度校准值 (Temperature calibration value) */
    tempCorrection: number;
    /** 当前的工作模式，0: 手动(MANUAL), 1: 关闭（ECO）, 2: 自动(AUTO) (Current working mode) */
    workMode: '0' | '1' | '2';
    /** 加热状态，0: 保温，1: 加热中 (thermal state, 0: Keeping, 1: Heating) */
    workState: '0' | '1';
    /** 开窗检测 (Window detection) */
    windowSwitch: boolean;
    /** 童锁 (child lock) */
    childLock: boolean;
}

export interface ILanState22 {
    /** 球泡灯灯光的开关，on 打开，off 关闭 （The switch of the bulb light, on turns on, off turns off） */
    state: 'on' | 'off';
    /** 球泡灯通道1，表示冷光，取值范围25-255(Bulb lamp channel 1, indicating cold light, value range 25-255)  */
    channel0: string;
    /** 球泡灯通道2，表示暖光，取值范围25-255(Bulb light channel 2, indicating warm light, value range 25-255) */
    channel1: string;
    /** R值，红色通道范围0-255(R value, red channel range 0-255)  */
    channel2: string;
    /** G值，绿色通道范围0-255(G value, green channel range 0-255) */
    channel3: string;
    /** B值，蓝色通道范围0-255(B value, blue channel range 0 255) */
    channel4: string;
    /** cold,middle,warm ,channel0>channel1 cold 、channel0=channel1 middle 、channel0<channel1 warm */
    type: 'cold' | 'middle' | 'warm';
}

export interface ILanState154 {
    /** on 开，off 关（on open，off close） */
    switch: 'on' | 'off';
}

export interface ILanState36 {
    /** 单路调光面板灯光亮度值的调整，取值范围10-100，值越大越亮 (Adjustment of the light brightness value of a single-channel dimming panel. The value range is 10 to 100. The larger the value, the brighter it is.) */
    bright: number;
}

export interface ILanState173And137 {
    /** 灯带模式(Light strip mode)
     * 0 色环模式；1 色盘模式； 2 CCT模式； 3 W模式；4 律动模式；5 DIY 模式；6-52 共47个幻彩情景模式
     * 0 color circle mode; 1 color wheel mode; 2 CCT mode; 3 W mode; 4 rhythm mode; 5 DIY mode; 6-52 47 colorful scene modes in total
     */
    mode: number;
    /** 灯带亮度值 [1,100] 亮度和色温需要一起下发
     * Light strip brightness value [1,100] Brightness and color temperature need to be sent together
     */
    bright: number;
    /**
     * 红色通道值 [0,255]
     * Red channel value [0,255]
     */
    colorR: number;
    /**
     * 绿色色通道值 [0,255]
     * Green channel value [0,255]
     */
    colorG: number;
    /**
     * 蓝色通道值 [0,255]
     * Blue channel value [0,255]
     */
    colorB: number;
    /** 色温值 [0,100](Color temperature value) */
    colorTemp: number;
}

export interface ILanState59 {
    /**
     * [1,12]	灯带可选的模式，总共12个模式：1 七彩（普通），2 七彩渐变，3 七彩跳变，4 DIY 渐变，5 DIY 流光，6 DIY 跳变，7 DIY 频闪，8 RGB 渐变，9 RGB 流光，10 RGB 跳变，11 RGB 频闪，12 音乐可视化
     * [1,12] Optional modes for the light strip, a total of 12 modes: 1 colorful (normal), 2 colorful gradient, 3 colorful jump, 4 DIY gradient, 5 DIY streamer, 6 DIY jump, 7 DIY strobe, 8 RGB gradient, 9 RGB streamer, 10 RGB jump, 11 RGB strobe, 12 music visualization
     */
    mode: number;
    /** 灯带亮度值 [1,100] 亮度和色温需要一起下发
     * Light strip brightness value [1,100] Brightness and color temperature need to be sent together
     */
    bright: number;
    /**
     * 红色通道值 [0,255]
     * Red channel value [0,255]
     */
    colorR: number;
    /**
     * 绿色色通道值 [0,255]
     * Green channel value [0,255]
     */
    colorG: number;
    /**
     * 蓝色通道值 [0,255]
     * Blue channel value [0,255]
     */
    colorB: number;
    /** 色温值(Color temperature value) */
}

export interface ILanState5 {
    /**
     * 统计用电量，start开始统计，stop结束统计，get刷新，单位Kwh
     * Statistics of electricity consumption, start to start statistics, stop to end statistics, get refresh, unit kwh
     */
    onKwh: 'start' | 'stop' | 'get';
    /**
     * 统计本次用电量的结束时间，零时区 utc
     * The end time of counting this electricity consumption, zero time zone
     */
    endTime: string;
    /**
     * 统计本次用电量的开始时间，零时区 utc
     * The start time of counting this electricity consumption, zero time zone
     */
    startTime: string;
}

export interface ILanState57 {
    /** 单色球泡灯灯光的开关，on 打开，off 关闭 (The switch of the monochrome bulb light, on turns on, off turns off) */
    state: 'on' | 'off';
    /** 单色球泡灯灯光亮度值的调整，取值范围25-255，值越大越亮 (Adjustment of the light brightness value of single-color bulbs, the value range is 25-255, the larger the value, the brighter it is) */
    channel0: string;
}

export interface ILanState52 {
    /** 吸顶灯灯光的开关，on 打开，off 关闭 (The switch of the ceiling light, on means to turn it on, off means to turn it off) */
    state: 'on' | 'off';
    /** 吸顶灯灯光亮度值的调整，取值范围25-255 (Adjustment of ceiling light brightness value, value range 25-255) */
    channel0: string;
    /** 吸顶灯灯光色温值的调整，取值范围25-255，值越大越暖 (Adjustment of the color temperature value of the ceiling light. The value range is 25-255. The larger the value, the warmer it is.) */
    channel1: string;
}


export interface ILanState11 {
    /** 电动窗帘开关，on 打开，off 关闭，pause 暂停 (Electric curtain switch, on opens, off closes, pause pauses) */
    switch:'on'|'pause'|'off',
    /** 窗帘开启比例，0 全开，100 全关 (Curtain opening ratio, 0 is fully open, 100 is fully closed) */
    setclose:number;
    /** [-50,-100]	信号强度，单位dbm (Signal strength, unit dbm) */
    rssi:number;
}
