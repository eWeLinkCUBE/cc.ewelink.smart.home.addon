"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7002_PROTOCOL = void 0;
exports.UIID7002_PROTOCOL = {
    uiid: 7002,
    initParams: device => {
        const { battery = 100, motion = 0, trigTime, subOtaInfo } = device.itemData.params;
        return { battery, motion, trigTime, subOtaInfo };
    },
    controlItem: {}
};
