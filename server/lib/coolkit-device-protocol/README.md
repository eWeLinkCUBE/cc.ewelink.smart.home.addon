## 协议库

### 代码结构
**设备功能清单见 /ts/interface/IDeviceProtocol.ts**
**支持设备清单见 /uiidModule/index.ts uiidMap 定义**
```
|-- assets
	|-- data.ts // 测试设备数据

|-- constant
	|-- index.ts // 一些常量

|-- controler
	|-- index.ts
		|-- controlDevice() // 控制设备的方法
	|-- initDeviceList.ts // 初始化云端 设备or群组 数据

|-- protocol // 一些通用的控制方法，多个设备共用才会定义

|-- ts

|-- uiidModule
	｜-- DeviceClass.ts // 云端设备初始化类
	｜-- GroupClass.ts // 云端场景初始化类
	｜-- index.ts
		|-- uiidMap // uiid配置的map集合
		|-- initCloudDeviceOrGroup()
		|-- getUiidCapability()
		|-- initUiidParams()
	...uiid模板

|-- utils
	|-- denyFeatureUtils.ts // 功能可配置utils

```

### 设备支持清单

#### 开关插座类 45

1. 单通道 1,6,14,24,27
2. 多通道 2,3,4,7,8,9,29,30,31,82,83,84,113,114,139,140,141,161,162,163
3. 单通道设备多通道协议 77,78,81,107,112,138,160
4. zigbee 1009,1256,2256,7004,7005,7010,7011,7012,7013
5. ha 20001,20002

#### 温控器 5

1. wifi 15,181
2. zigbee 1770,1771,7014

#### 功率检测 8

1. 5,32,126,127,130,165,190
   **182 单通道设备多通道协议**

#### 窗帘 1

1. 11

#### 灯 17

1. wifi 22,57,103,104,135,136
2. zigbee 1257,1258,3258,7008,7009
3. ha 20005,20006,20007,20008,
4. Yeelight 197,198,

#### rf 网关 2

1. 28,98

#### 灯带 4

1. 59,137,173,196

#### 传感器 6

1. 102 门磁
2. 154 新版门磁
3. 1000,2026,3026,4026

#### 特殊 11

36 调光开关
34 风扇灯
44 智能调光器
65 手机摄像头
67 卷帘门
87 IOT 摄像头
133 nspanel
151 空调
174 R5 六按键
177 S-MATE 三按键
195 nspanelpro

### 设备功能清单

1. 开关
2. 点动
3. 通电反应
4. 网络指示灯
5. 互锁

用电量刷新
用电量开始
用电量结束

获取历史功率数据

设置窗帘百分比
设置窗帘控制

空调设置

过载保护（130）
重置总用电量
获取特定时间范围内用电数据（190）

亮度
色温
颜色
模式

报警器布防
报警器撤防

更新电机功能
控制电动卷帘门

缓慢亮起
设置凌动功能开关状态

```ts
// add
    // 138-141、160-163  学习模式
    setLearnMode: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'learnMode'>;
    // 138-141、160-163  443学习模式
    setLearnMode443: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'learnMode433'>;
    // 160-163  设置通道指示灯灭时亮度
    setOffBrightness: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'offBrightness'>;
    // 15、181  自动控制
    autoControl: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'deviceType' | 'mainSwitch' | 'targets' | 'autoControl' | 'autoControlEnabled'>;
    // 15 设置土壤类型
    setSoilType: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'soilType'>;
    // 181、7014  设置温度单位
    setTempUnit: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'tempUnit'>;
    // 7014  设置温湿度舒适度
    setComfort: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'tempComfortLower' | 'tempComfortUpper' | 'humiComfortLower' | 'humiComfortUpper'>;
    // 135、7008、7009  缓启设置
    setSlowlyLit: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'slowlyLit'>;
    // 135、7008、7009  缓灭设置
    setSlowlyDimmed: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'slowlyDimmed'>;
    // 7008、7009  设置分段调光和凌动（两者互斥）
    setDimming: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'dimming' | 'quickSwitch'>;
    // 137、173  线序调整
    setLineSequence: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'lineSequence'>;
    // 173  设置ic类型
    setIcType: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'icType'>;
    // 173  设置ic数量
    setIcNUmber: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'icNumber'>;
    // 34  设置风扇开关和档位
    setFan: (controlItem: IControlItemParams) => TMultiCapability;
    // 44  设置最暗值
    setBrightMin: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'switch' | 'brightMin' | 'brightMax' | 'brightness' | 'mode'>;
    // 67  卷帘门 开关停
    setRollerShuttersAction: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'op'>;
    // 67  卷帘门 百分比
    setRollerShuttersPercent: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'per'>;
    // 67  卷帘门 电机功能
    setRollerShuttersMotor: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'set'>;
    // 151  美的空调 温度
    setMediaTemp: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'temperature'>;
    // 151  美的空调 风速
    setMediaWindSpeed: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'wind_speed'>;
    // 151  美的空调 摆风
    setMediaWindSwing: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'wind_swing_ud' | 'wind_swing_lr'>;
    // 151  美的空调 延时开关
    setMediaDelaySwitch: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'power_off_timer' | 'power_off_time_value' | 'power_on_timer' | 'power_on_time_value'>;
    // 151  美的空调 模式
    setMediaMode: (controlItem: IControlItemParams) => Pick<IDeviceParams, 'mode'>;
```

- uiid22：亮度、色温、颜色、情景
- uiid28：
- uiid32：过载保护、费率设置
- uiid34：风扇开关
- uiid67：开关停、按比例开启、电机功能设置
- uiid98：网络指示灯、报警器布防、布防延时生效
- uiid126：开关模式（通电反应、点动、设置外接开关的模式、设置开关控制翻转）、电机模式（电机动作类型、轨道移动、设置外接开关的类型、设置遇阻停止模式）、网络指示灯
- uiid127：开关、设置目标温度、设置误差温度、切换模式（手动、编程、节能）、童锁、温度单位
- uidd133：温度单位
- uiid137：情景
- uiid151：开关、目标温度、模式、风速、摆风
- uiid165：开关模式（点动、设置外接开关的模式、设置开关控制翻转）、电机模式（电机动作类型、轨道移动、设置外接开关的类型、设置遇阻停止模式）
- uiid173：模式、情景
- uiid181：温度单位
- uiid182：开关、通电反应、点动、网络指示灯
- uiid196：开关、颜色、亮度
- uiid197：开关、色温、亮度
- uiid1770：温度单位
- uiid1771：温度单位、舒适度设置
- uiid7004：通电反应
- uiid7008：开关、亮度、色温、通电反应、开关渐变、回弹开关
- uiid7009: 开关、亮度、色温、颜色、模式、情景、通电反应、开关渐变、回弹开关
- uiid7014：温度单位
- uiid20001：开关
- uiid20002：开关
-