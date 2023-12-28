import { IDeviceProtocolManager } from '../ts/interface/IDeviceProtocol';
import { TLightSceneLType } from '../ts/interface/IDeviceParams';
export declare const UIID135_PROTOCOL: IDeviceProtocolManager;
export declare const sceneConfig: Partial<Record<TLightSceneLType, {
    br: number;
    ct: number;
}>>;
