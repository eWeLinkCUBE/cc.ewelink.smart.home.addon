/** 单通道开关或插座的局域网state数据 (LAN state data for a single channel switch or socket) */
export interface ILanStateSingleSwitch {
    switch: 'on' | 'off';
}
//多通道里的通道数据 (Channel data in multi-channel)
export interface ILanStateSwitch {
    switch: 'on' | 'off';
    outlet: number;
}

/** 多通道开关或插座的局域网state数据 (LAN state data for multi-channel switches or sockets)*/
export interface ILanStateMultipleSwitch {
    switches: ILanStateSwitch[];
}

export interface ILanState190 {
    switches: { switch: 'on' | 'off'; outlet: 0 }[];
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
    switch: 'on' | 'off';
}

export interface ILanState181and15 {
    switch: 'on' | 'off';
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
    switches?: { switch: 'on' | 'off'; outlet: 0 }[];
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
    light: 'off' | 'on';
    fan: 'off' | 'on';
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
/** 运动传感器 (motion sensor) */
export interface ILanStateMotionSensor {
    /** 移动事件，Number型。取值范围[0,1]，0⽆⼈，1有⼈ (Movement event, number type. Value range [0,1], 0 is empty, 1 is occupied) */
    motion: 0 | 1;
    /** 电池电量百分⽐，Number型。取值范围[0,100] (Battery power percentage, number type. Value range[0,100]) */
    battery: number;
}
/** 7016 */
export interface ILanStatePersonExist {
    /** 0 - 无人状态(Unmanned state) 1 - 有人状态(Someone's status) */
    human: 0 | 1;
    /** "brighter" - 较亮(brighter) "darker" - 较暗(darker) */
    brState: 'darker' | 'brighter';
}
