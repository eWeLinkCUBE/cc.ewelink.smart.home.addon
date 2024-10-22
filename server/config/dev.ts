import { COOLKIT_SECRET } from './secret';

export const devConf = {
    nodeApp: {
        env: 'dev',
        port: 8321,
        dataPath: '',
        dbPath: '',
        name: 'ewelink-smart-home',
        version: '',
    },
    coolKit: COOLKIT_SECRET,
    auth: {
        appId: 'HyeXzioQe4gpfvTS',
        appSecret: 'KCLh*HfIik$CWf1M@^%TFit45eq9Ha@w',
    },
    iHost: {
        api: 'http://192.168.5.217/open-api/v1/rest',
    },
    log: {
        path: 'log/logFile/total_dev.log',
        pattern: '-yyyy-MM-dd.log',
    },
    timeConfig: {
        /** mDns多久搜索不到就,设置为离线 单位秒 (How long does it take for mDns to fail to be searched? Set it to offline in seconds.) */
        disappearTime: 6 * 30,
        /** mDns间隔多久扫描一次,单位秒  (M dns scan interval, unit seconds)*/
        mDnsGapTime: 30,
        /** 多久调用一次易微连api接口,单位秒  (How often to call the eWelink API interface, in seconds)*/
        eweLinkGapTime: 30,
        /** 多久调用一次iHost接口,单位秒  (How often the iHost interface is called, unit秒)*/
        iHostGapTime: 30,
        /** 多久运行自动同步和自动取消同步程序,单位秒  (How long to run the automatic synchronization and automatic cancel sync program, in seconds)*/
        autoSyncGapTime: 30,
        /** 多久运行自动取消同步程序,单位秒  (How long to run the automatic cancel sync program, in seconds)*/
        autoCancelSyncGapTime: 30,
        /** 定时刷新ewelink的 at,默认一天  (Refresh ewelink's at regularly, one day by default)*/
        refreshEWeLinkTokenGapTime: 24 * 60 * 60,
    },
    /** 启动的ip (startup ip)*/
    localIp: 'http://192.168.5.194:8321',
};
