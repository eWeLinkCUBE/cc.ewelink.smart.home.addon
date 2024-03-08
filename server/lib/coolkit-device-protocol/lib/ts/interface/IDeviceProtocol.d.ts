import { ICoolkitCloudDeviceData, ICoolkitCloudGroupData } from './ICoolkitDevice';
import { IDevice } from './IDevice';
import { IControlDeviceParams } from './IControlDevice';
import { IDeviceParams } from './IDeviceParams';
import { TMultiCapability, TSingleCapability, TSledOnline, TSingleInching, TMultiInching, TSingleStartup, TMultiStartup, TLock, TCurtainPercent, TActivePower, THistoryPower, TStatisticsPower, TLightColorTemperature, TBackLight, TLightSceneMode, TCurtain, TRfGateway, TTempUnit, TTargetTemp, TChildLock, TWorkMode, TStopMode, TZled, TSecurityType, TAlarmBeeps, TMediaTotal, TSlowly, TToggle, TLightScene22, TAutoControl, TOperateHistory, TBrightAdjust, TColorTempAdjust, TSensitivity, TDetectedDuration, TWindowSwitch, TempCorrection, TEcoTargetTemp, TScheduleData } from '../type/TControlType';
import { IGroup } from './IGroup';
export interface IDeviceProtocol {
    toggle: (controlItem: IControlItemParams) => TSingleCapability | TMultiCapability;
    toggleMulti: (controlItem: IControlItemParams) => TMultiCapability;
    toggleFan: (controlItem: IControlItemParams) => TMultiCapability;
    setSledOnline: (controlItem: IControlItemParams) => TSledOnline;
    setZled: (controlItem: IControlItemParams) => TZled;
    setSingleInchingMode: (controlItem: IControlItemParams) => TSingleInching;
    setMultiInchingMode: (controlItem: IControlItemParams) => TMultiInching;
    setSingleStartup: (controlItem: IControlItemParams) => TSingleStartup;
    setMultiStartup: (controlItem: IControlItemParams) => TMultiStartup;
    setLock: (controlItem: IControlItemParams) => TLock;
    setMultiLock: (controlItem: IControlItemParams) => any;
    setTempUnit: (controlItem: IControlItemParams) => TTempUnit;
    setTargetTemp: (controlItem: IControlItemParams) => TTargetTemp;
    setChildLock: (controlItem: IControlItemParams) => TChildLock;
    setWorkMode: (controlItem: IControlItemParams) => TWorkMode;
    setStopMode: (controlItem: IControlItemParams) => TStopMode;
    setSecurityType: (controlItem: IControlItemParams) => TSecurityType;
    setAlarmBeeps: (controlItem: IControlItemParams) => TAlarmBeeps;
    setMediaAirCondition: (controlItem: IControlItemParams) => TMediaTotal;
    setBrightness: (controlItem: IControlItemParams) => any;
    setColorTemperature: (controlItem: IControlItemParams) => TLightColorTemperature;
    setColor: (controlItem: IControlItemParams) => any;
    setLightScene: (controlItem: IControlItemParams) => TLightSceneMode | TLightScene22;
    setLightMode: (controlItem: IControlItemParams) => any;
    setSlowly: (controlItem: IControlItemParams) => TSlowly;
    setToggle: (controlItem: IControlItemParams) => TToggle;
    setBrightAdjust: (controlItem: IControlItemParams) => TBrightAdjust;
    setColorTempAdjust: (controlItem: IControlItemParams) => TColorTempAdjust;
    setCurtainPercent: (controlItem: IControlItemParams) => TCurtainPercent;
    setCurtainAction: (controlItem: IControlItemParams) => TSingleCapability;
    refreshPowerInfo: (controlItem: IControlItemParams) => TActivePower;
    getHistoryPower: (controlItem: IControlItemParams) => THistoryPower;
    statisticsPower: (controlItem: IControlItemParams) => TStatisticsPower;
    controlCurtain: (controlItem: IControlItemParams) => TCurtain;
    setBackLight: (controlItem: IControlItemParams) => TBackLight;
    setFanLightMode: (controlItem: IControlItemParams) => TMultiCapability;
    controlRfGatewayDevice: (controlItem: IControlItemParams) => TRfGateway;
    autoControl: (controlItem: IControlItemParams) => TAutoControl;
    getOperateHistory: (controlItem: IControlItemParams) => TOperateHistory;
    setSensitivity: (controlItem: IControlItemParams) => TSensitivity;
    setDetectedDuration: (controlItem: IControlItemParams) => TDetectedDuration;
    setMultiLightControl: (controlItem: IControlItemParams) => any;
    setWindowSwitch: (controlItem: IControlItemParams) => TWindowSwitch;
    setTempCorrection: (controlItem: IControlItemParams) => TempCorrection;
    setEcoTargetTemperature: (controlItem: IControlItemParams) => TEcoTargetTemp;
    setSchedule: (controlItem: IControlItemParams) => TScheduleData;
}
export interface IControlItemParams extends Partial<IControlDeviceParams> {
    device: IDevice | IGroup;
}
export interface IDeviceProtocolManager {
    uiid: number;
    initParams: (device: ICoolkitCloudDeviceData | ICoolkitCloudGroupData) => Partial<IDeviceParams>;
    controlItem: Partial<IDeviceProtocol>;
}
