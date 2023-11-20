export default interface IEWeLinkDevice {
    itemType: 1;
    itemData: DeviceListItem;
    index: number;
    familyName: string;
}

interface DeviceListItem {
    name: string;
    deviceid: string;
    apikey: string;
    extra: any;
    brandName: string;
    brandLogo: string;
    showBrand: boolean;
    productModel: string;
    devGroups?: {
        type: number;
        groupId: string;
    }[];
    tags?: any;
    devConfig?: any;
    settings?: any;
    family: FamilyItem;
    devicekey: string;
    online: boolean;
    params?: any;
    gsmInfoData?: any;
}

interface FamilyItem {
    familyid: string;
    index: number;
    roomid?: string;
}
