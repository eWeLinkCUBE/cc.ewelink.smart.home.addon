import type { EDisplayCategory } from "../enum/EDisplayCategory";
import type ENetworkProtocol from "../enum/ENetworkProtocol";

export interface IBeforeLoginDevice {
    deviceId: string;
    category: string;
}


export interface IAfterLoginDevice {
    deviceId: string;
    deviceName: string;
    displayCategory: EDisplayCategory;
    familyName: string;
    isMyAccount: boolean;
    isOnline: boolean;
    isSupported: boolean;
    isSynced: boolean;
    subDeviceNum: number;
    networkProtocol: ENetworkProtocol;
}
