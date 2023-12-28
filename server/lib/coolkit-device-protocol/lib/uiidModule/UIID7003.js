"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7003_PROTOCOL = void 0;
exports.UIID7003_PROTOCOL = {
    uiid: 7003,
    initParams: device => {
        const { battery = 100, lock = 1, trigTime, subOtaInfo } = device.itemData.params;
        return { battery, lock, trigTime, subOtaInfo };
    },
    controlItem: {}
};
