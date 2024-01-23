//内存中保存已建立sse的zigbee-p网关设备id
//Save the zigbee p gateway device ID of the established SSE in the memory

interface ZigbeePSsePoolMap {
    updateTime: number;
    ip: string;
}

class zigbeePSseMapClass {
    public zigbeePSsePoolMap: Map<string, ZigbeePSsePoolMap>;
    constructor() {
        this.zigbeePSsePoolMap = new Map();
    }
}
export default new zigbeePSseMapClass();
