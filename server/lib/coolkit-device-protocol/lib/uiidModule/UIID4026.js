"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID4026_PROTOCOL = void 0;
exports.UIID4026_PROTOCOL = {
    uiid: 4026,
    initParams: device => {
        const { battery = 100, water = 0, trigTime } = device.itemData.params;
        return { battery, water, trigTime };
    },
    controlItem: {}
};
