export interface IBeforeLoginDevice {
    deviceId: string;
    category: string;
}

export interface IAfterLoginDevice {
    deviceId: string;
    deviceName: string;
    displayCategory: string;
    familyName: string;
    isMyAccount: boolean;
    isOnline: boolean;
    isSupported: boolean;
    isSynced: boolean;
    subDeviceNum: number;
    networkProtocol: 'lan' | 'zigbee';
}
