import getIHostSyncDeviceList from '../services/public/getIHostSyncDeviceList';
import mdns from './initMdns';
import config from '../config';
import db from './db';
import deviceMapUtil from './deviceMapUtil';
import refreshEWeLinkToken from '../services/public/refreshEWeLinkToken';
import logger from '../log';

const { mDnsGapTime, eweLinkGapTime, refreshEWeLinkTokenGapTime } = config.timeConfig;
/** mDns发起询问 (M dns initiated inquiry)*/
function queryMdns() {
    mdns.query({
        questions: [
            {
                name: '_ewelink._tcp.local',
                type: 'PTR',
            },
        ],
    });
    deviceMapUtil.setOffline();
}

/** 是否能运行获取易微联接口，是否能运行获取iHost后端接口，是否能运行自动同步和自动取消同步 (Whether it is possible to obtain the iWeLink interface, whether it is possible to obtain the iHost backend interface, whether it is possible to perform automatic synchronization and automatic cancellation of synchronization)*/
function canRun() {
    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
    const iHostToken = db.getDbValue('iHostToken');
    return {
        canRunGetEWeLink: !!eWeLinkApiInfo, //已登录 (Has logged)
        canRunGetIHost: !!(eWeLinkApiInfo && iHostToken), //已登录且有网关凭证 (Logged in and have gateway credentials)
        canRunAutoSync: !!(eWeLinkApiInfo && iHostToken), //已登录且有网关凭证 (Logged in and have gateway credentials)
        canRunAutoCancelSync: !!(eWeLinkApiInfo && iHostToken), //已登录且有网关凭证 (Logged in and have gateway credentials)
    };
}

/** 每隔一段时间拉取一次数据 (Pull data every once in a while) */
export default function gapTimeRun() {
    queryMdns();
    getIHostSyncDeviceList();
    refreshEWeLinkToken();

    // 局域网查询设备 LAN query equipment
    setInterval(() => {
        queryMdns();
    }, mDnsGapTime * 1000);

    // 登录后而且有网关凭证之后调用iHost接口 After logging in and having gateway credentials, call the i host interface
    setInterval(() => {
        const { canRunGetIHost } = canRun();
        if (canRunGetIHost) {
            getIHostSyncDeviceList();
        }
    }, eweLinkGapTime * 1000);

    // 定时查看是否需要刷新ewelink的at Check regularly whether ewelink’s at needs to be refreshed
    setInterval(() => {
        logger.info('check at --------------refresh');
        refreshEWeLinkToken();
    }, refreshEWeLinkTokenGapTime * 1000);
}
