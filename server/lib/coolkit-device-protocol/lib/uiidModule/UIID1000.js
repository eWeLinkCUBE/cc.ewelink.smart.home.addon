"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID1000_PROTOCOL = void 0;
exports.UIID1000_PROTOCOL = {
    uiid: 1000,
    initParams: device => {
        const { battery = 100, key, trigTime } = device.itemData.params;
        return { battery, key, trigTime };
    },
    controlItem: {}
};
