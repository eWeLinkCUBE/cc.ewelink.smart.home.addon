//内存中保存zigbee-p子设备的在线状态
//Save the online status of the zigbee p sub-device in memory

class zigbeePSubDevicesOnlineMapClass {
    public zigbeePSubDevicesMap: Map<string, boolean>;
    constructor() {
        this.zigbeePSubDevicesMap = new Map();
    }
}
export default new zigbeePSubDevicesOnlineMapClass();
