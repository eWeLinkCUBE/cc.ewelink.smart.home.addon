export interface IPingRes {
    /** 是否ping得通 (Is pinging possible?)*/
    alive: boolean;
    /** 设备ip地址 (Device IP address)*/
    numeric_host: string;
}
