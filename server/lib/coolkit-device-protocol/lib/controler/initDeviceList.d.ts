import { ICoolkitCloudDeviceData, ICoolkitCloudGroupData } from '../ts/interface/ICoolkitDevice';
import { IDevice } from '../ts/interface/IDevice';
import { IGroup } from '../ts/interface/IGroup';
export declare function initDeviceList(devices: Array<ICoolkitCloudDeviceData | ICoolkitCloudGroupData>): {
    devices: IDevice[];
    groups: IGroup[];
};
