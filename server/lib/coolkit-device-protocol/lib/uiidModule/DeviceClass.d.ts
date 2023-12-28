import { ICoolkitCloudDeviceData } from '../ts/interface/ICoolkitDevice';
import { IDevice } from '../ts/interface/IDevice';
import { IDeviceParams } from '../ts/interface/IDeviceParams';
export declare class DeviceClass implements IDevice {
    index: number;
    itemType: number;
    apikey: string;
    brandLogo: string;
    brandName: string;
    deviceid: string;
    devicekey: string;
    deviceFeature?: any;
    devGroups: {
        groupId: string;
        type: number;
    }[];
    familyid: string;
    roomid?: string;
    isSupportGroup?: boolean;
    mac: string;
    model: string;
    name: string;
    online: boolean;
    params: Partial<IDeviceParams>;
    productModel: string;
    showBrand: boolean;
    tags: any;
    uiid: number;
    settings?: any;
    denyFeatures?: Array<any>;
    constructor(device: ICoolkitCloudDeviceData);
}
