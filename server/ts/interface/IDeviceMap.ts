import { IMdnsParseRes } from './IMdns';
export default interface IDeviceMap {
    deviceId: string;
    discoveryTime: number;
    deviceData: IMdnsParseRes;
}
