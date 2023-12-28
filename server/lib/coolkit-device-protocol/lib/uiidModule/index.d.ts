import { ICoolkitCloudDeviceData, ICoolkitCloudGroupData } from '../ts/interface/ICoolkitDevice';
import { IDevice } from '../ts/interface/IDevice';
import { IGroup } from '../ts/interface/IGroup';
import { DeviceClass } from './DeviceClass';
import { GroupClass } from './GroupClass';
export declare function initCloudDevice(data: ICoolkitCloudDeviceData): DeviceClass;
export declare function initCloudGroup(data: ICoolkitCloudGroupData): GroupClass;
export declare function getUiidCapability(device: IDevice | IGroup): Partial<import("../ts/interface/IDeviceProtocol").IDeviceProtocol> | undefined;
export declare function initUiidParams(data: ICoolkitCloudDeviceData | ICoolkitCloudGroupData): Partial<import("../ts/interface/IDeviceParams").IDeviceParams>;
