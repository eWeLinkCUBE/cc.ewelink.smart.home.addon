import { IMdnsParseRes } from '../../ts/interface/IMdns';

// 内存中保存局域网扫描到的设备信息
// Save device information scanned by LAN in memory
interface IDeviceMap {
    discoveryTime: number;
    deviceData: IMdnsParseRes;
}

class DeviceMapClass {
    public deviceMap: Map<string, IDeviceMap>;
    constructor() {
        this.deviceMap = new Map();
    }
}
export default new DeviceMapClass();
