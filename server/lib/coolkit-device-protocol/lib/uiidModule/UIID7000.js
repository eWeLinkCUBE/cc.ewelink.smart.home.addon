"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7000_PROTOCOL = void 0;
exports.UIID7000_PROTOCOL = {
    uiid: 7000,
    initParams: device => {
        const { battery = 100, key, trigTime, subOtaInfo } = device.itemData.params;
        return { battery, key, trigTime, subOtaInfo };
    },
    controlItem: {}
};
