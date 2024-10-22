"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const api_1 = require("./api");
const utils_1 = require("./utils");
function init(params) {
    const { appId, appSecret, debug, useTestEnv = false, at, rt, countryCode, timeout, region } = params;
    (0, store_1.setAppId)(appId);
    (0, store_1.setAppSecret)(appSecret);
    (0, store_1.setUseTestEnv)(useTestEnv);
    if (debug) {
        (0, store_1.setDebug)(debug);
    }
    if (at) {
        (0, store_1.setAt)(at);
    }
    if (rt) {
        (0, store_1.setRt)(rt);
    }
    if (countryCode) {
        (0, store_1.setDomain)((0, utils_1.getDomainByCountryCode)(countryCode));
    }
    if (region) {
        (0, store_1.setDomain)((0, utils_1.getDomainByRegion)(region));
    }
    if (timeout) {
        (0, store_1.setTimeout)(timeout);
    }
    if (useTestEnv) {
        (0, store_1.setDomain)('https://test-apia.coolkit.cn');
    }
}
exports.default = {
    init,
    showStore: store_1.showStore,
    user: api_1.user,
    home: api_1.home,
    device: api_1.device,
    family: api_1.family,
    message: api_1.message,
    scene: api_1.scene,
    other: api_1.other,
    openPlatform: api_1.openPlatform,
    energy: api_1.energy,
    getCmsContent: utils_1.getCmsContent,
    setBlockList: store_1.setBlockList
};
