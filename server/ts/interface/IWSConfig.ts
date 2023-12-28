export default interface IWSConfig {
    at: string;
    apikey: string;
    appid: string;
    region: 'cn' | 'us' | 'eu' | 'as';
    userAgent: 'app' | 'pc_ewelink';
    useTestEnv?: boolean;
    debug?: boolean;
    reqTimeout?: number;
    heartBeatRatio?: number;
    retryInterval?: number;
    maxRetry?: number;
    /** 最大重试总时间，以秒为单位，默认为2小时 */
    maxRetryInterval?: number;
}
