import { ICoolkitCloudGroupData } from "../ts/interface/ICoolkitDevice";
import { IDeviceParams } from "../ts/interface/IDeviceParams";
import { IGroup } from "../ts/interface/IGroup";
export declare class GroupClass implements IGroup {
    index: number;
    itemType: number;
    id: string;
    name: string;
    mainDeviceId: string;
    familyid: string;
    roomid?: string;
    params: Partial<IDeviceParams>;
    uiid: number;
    constructor(group: ICoolkitCloudGroupData);
}
