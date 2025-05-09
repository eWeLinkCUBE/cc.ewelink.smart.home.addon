import IEWeLinkDevice from "./IEWeLinkDevice";
import { IHostStateInterface } from "./IHostState";

export default interface IIHostStateFormatWhenSyncParams {
    deviceId: string;
    eWeLinkDeviceData: IEWeLinkDevice;
    iHostState: IHostStateInterface;
    lanState: any;
}