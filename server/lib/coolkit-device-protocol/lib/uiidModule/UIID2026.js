"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID2026_PROTOCOL = void 0;
exports.UIID2026_PROTOCOL = {
    uiid: 2026,
    initParams: device => {
        const { battery = 100, motion = 0, trigTime } = device.itemData.params;
        return { battery, motion, trigTime };
    },
    controlItem: {}
};
