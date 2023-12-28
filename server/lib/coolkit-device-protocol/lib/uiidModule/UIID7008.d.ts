import { TLightSceneLType } from '../ts/interface/IDeviceParams';
import { IDeviceProtocolManager } from '../ts/interface/IDeviceProtocol';
export declare const UIID7008_PROTOCOL: IDeviceProtocolManager;
export declare const sceneConfig: Partial<Record<TLightSceneLType, {
    br: number;
    ct: number;
}>>;
