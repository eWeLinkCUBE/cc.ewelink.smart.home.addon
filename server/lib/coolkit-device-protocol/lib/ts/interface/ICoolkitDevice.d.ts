import { IDeviceParams } from './IDeviceParams';
export interface ICoolkitCloudDeviceData {
    index: number;
    itemType: number;
    itemData: {
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
        extra: ICoolkitDeviceExtra;
        family: IFamily;
        isSupportChannelSplit?: boolean;
        isSupportGroup?: boolean;
        isSupportedOnMP?: boolean;
        name: string;
        online: boolean;
        params: Partial<IDeviceParams>;
        productModel: string;
        settings?: any;
        sharedBy?: any;
        shareTo?: Array<any>;
        showBrand: boolean;
        tags: any;
        wxModelId?: string;
    };
}
export interface ICoolkitCloudGroupData {
    index: number;
    itemType: number;
    itemData: {
        id: string;
        name: string;
        mainDeviceId: string;
        family: {
            familyid: string;
            index: number;
            roomid?: string;
        };
        params: Partial<IDeviceParams>;
        uiid: number;
    };
}
export interface IFamily {
    familyid: string;
    index: number;
    members?: Array<any>;
    roomid?: string;
}
export interface ICoolkitDeviceExtra {
    uiid: number;
    model: string;
    ui: string;
    description?: string;
    manufacturer: string;
    mac: string;
    apmac?: string;
    modelInfo?: string;
    brandId?: string;
    chipid?: string;
    staMac?: string;
}
