import ELanType from '../enum/ELanType';
export interface IMdnsRes {
    ptr: string;
    txt: {
        txtvers: number;
        id: string;
        type: ELanType;
        apivers: number;
        seq: number;
        encrypt: true;
        iv: string;
        data1?: string;
        data2?: string;
        data3?: string;
        data4?: string;
    };
    srv: {
        priority: number;
        weight: number;
        port: number;
        target: string;
    };
    a: string;
}

export interface IMdnsParseRes {
    /** 设备id (device id)*/
    deviceId: string;
    /** 设备类型 (device type)*/
    type: ELanType;
    /** 已加密的数据 (Encrypted data)*/
    encryptedData: string;
    /** 设备ip (device ip) */
    ip: string;
    /** 端口 (port)*/
    port: number;
    /** 目标地址 (target address)*/
    target: string;
    /** 加密时初始化向量的 Base64 值 (Base64 of initialization vector during encryption值)*/
    iv: string;
    /** 是否在线 (Is online)*/
    isOnline?: boolean;
}
