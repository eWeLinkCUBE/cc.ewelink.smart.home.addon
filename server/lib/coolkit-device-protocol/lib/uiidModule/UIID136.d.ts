import { TLightSceneLType } from '../ts/interface/IDeviceParams';
import { IDeviceProtocolManager } from '../ts/interface/IDeviceProtocol';
export declare const UIID136_PROTOCOL: IDeviceProtocolManager;
export declare const sceneConfig: Partial<Record<TLightSceneLType, {
    br: number;
    r: number;
    g: number;
    b: number;
    tf?: number;
    sp?: number;
}>>;
