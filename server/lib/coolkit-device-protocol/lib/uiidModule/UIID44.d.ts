import { TLightSceneLType } from '../ts/interface/IDeviceParams';
import { IDeviceProtocolManager } from '../ts/interface/IDeviceProtocol';
export declare const UIID44_PROTOCOL: IDeviceProtocolManager;
export declare const sceneConfig: Partial<Record<TLightSceneLType, {
    mode: number;
    switch: string;
    brightness: number;
}>>;
