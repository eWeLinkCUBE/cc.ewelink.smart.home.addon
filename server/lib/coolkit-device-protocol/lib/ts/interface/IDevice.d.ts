import { IDeviceParams } from './IDeviceParams';
export interface IDevice {
    index: number;
    itemType: number;
    apikey: string;
    brandLogo: string;
    brandName: string;
    denyFeatures?: Array<any>;
    devConfig?: any;
    devGroups?: Array<{
        groupId: string;
        type: number;
    }>;
    deviceFeature?: any;
    deviceid: string;
    devicekey: string;
    familyid: string;
    roomid?: string;
    isSupportChannelSplit?: boolean;
    isSupportGroup?: boolean;
    isSupportedOnMP?: boolean;
    mac: string;
    model: string;
    name: string;
    online: boolean;
    params: Partial<IDeviceParams>;
    productModel: string;
    settings?: any;
    sharedBy?: any;
    shareTo?: Array<any>;
    showBrand: boolean;
    tags: any;
    uiid: number;
    wxModelId?: string;
}
