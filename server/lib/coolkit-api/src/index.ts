import { setAppId, setAppSecret, showStore, setDebug, setUseTestEnv, setAt, setRt, setDomain, setTimeout } from './store';
import { user, home, device, family, message, scene, other, openPlatform } from './api';
import { getDomainByCountryCode, getCmsContent, getDomainByRegion } from './utils';

/**
 * 初始化
 * @param params 初始化参数
 */
function init(params: { appId: string; appSecret: string; debug?: boolean; useTestEnv?: boolean; at?: string; rt?: string; countryCode?: string; timeout?: number; region?: string; }) {
    const { appId, appSecret, debug, useTestEnv = false, at, rt, countryCode, timeout, region } = params;
    setAppId(appId);
    setAppSecret(appSecret);
    setUseTestEnv(useTestEnv);
    if (debug) {
        setDebug(debug);
    }
    if (at) {
        setAt(at);
    }
    if (rt) {
        setRt(rt);
    }
    if (countryCode) {
        setDomain(getDomainByCountryCode(countryCode));
    }
    if (region) {
        setDomain(getDomainByRegion(region));
    }
    if (timeout) {
        setTimeout(timeout);
    }
    if (useTestEnv) {
        setDomain('https://test-apia.coolkit.cn');
    }
}

export default {
    init,
    showStore,
    user,
    home,
    device,
    family,
    message,
    scene,
    other,
    openPlatform,
    getCmsContent
};
