import { IDeviceParams } from "./IDeviceParams";
export interface IGroup {
    index: number;
    itemType: number;
    id: string;
    name: string;
    mainDeviceId: string;
    familyid: string;
    roomid?: string;
    params: Partial<IDeviceParams>;
    uiid: number;
}
