import { EErrorCode } from "./enum";

interface IConfigForApp {
    at: string;
    apikey: string;
    appid: string;
    region: 'cn' | 'us' | 'eu' | 'as';
    userAgent: 'app' | 'pc_ewelink';
    useTestEnv?: boolean;
    debug?: boolean;
    /** 请求超时时间，毫秒为单位，默认为15000 */
    reqTimeout?: number;
    /** 心跳间隔的百分比，默认为90
     *  真实心跳时间 = 心跳时间 * (heartBeatRatio / 100)
     */
    heartBeatRatio?: number;
    /** 重试间隔 = retryCount * retryInterval， 以秒为单位 */
    retryInterval?: number;
    /** 最大重试次数 */
    maxRetry?: number;
    /** 最大重试总时间，以秒为单位，默认为2小时 */
    maxRetryInterval?: number;
}

interface IConfigForDevice {
    region: 'cn' | 'us' | 'eu' | 'as';
    apikey: string;
    chipid?: string;
    deviceid: string;
    userAgent: 'device';
    useTestEnv?: boolean;
    debug?: boolean;
    /** 请求超时时间，毫秒为单位，默认为15000 */
    reqTimeout?: number;
    /** 心跳间隔的百分比，默认为90
    *  真实心跳时间 = 心跳时间 * (heartBeatRatio / 100)
    */
    heartBeatRatio?: number;
    /** 重试间隔 = retryCount * retryInterval */
    retryInterval?: number;
    /** 最大重试次数 */
    maxRetry?: number;
    /** 最大重试总时间，毫秒为单位，默认为2小时 */
    maxRetryInterval?: number;
}

export type IConfig = IConfigForDevice | IConfigForApp;

export interface IWsParams {
    [key: string]: any;
}

export interface IDeviceConfig {
    deviceid: string;
    ownerApikey: string;
    params: any;
}

export interface IQueryConfig extends IDeviceConfig {
    params: string[];
}

export interface IUpgradeConfig extends IDeviceConfig {
    params: {
        model: string;
        version: string;
        binList: IBinList[];
    };
}

interface IBinList {
    downloadUrl: string;
    digest?: string;
    name: string;
}

export interface IResponse {
    error: number;
    msg: string;
    data?: WebSocket;
}

export interface IWsHandler {
    (wsResp: any): void;
}

export interface IDeviceResponse {
    error: number;
    deviceid: string;
    apikey: string;
    sequence: string;
    params?: any;
}

export interface ISendDeviceParams {
    action: 'upgrade' | 'update' | 'query';
    deviceid: string;
    apikey: string;
    userAgent: 'app' | 'device' | 'pc_ewelink';
    sequence: string;
    params: any;
    selfApikey?: string;
}

export type IReconnectEvent = IReconnectSuccess | IReconnectFail;

export interface IReconnectFail {
    error: EErrorCode;
    data: {
        /** 总重连时间,以秒为单位 */
        totalTime: number;
        /** 重连次数 */
        count: number;
    }
}

export interface IReconnectSuccess {
    error: 0;
    msg: string;
}


export interface IDispatchAppRes {
    error: number,
    reason: string,
    /** 服务器域名 */
    domain: string,
    /** 域名对应IP */
    IP: string,
    /** 服务器端口 */
    port: number
}