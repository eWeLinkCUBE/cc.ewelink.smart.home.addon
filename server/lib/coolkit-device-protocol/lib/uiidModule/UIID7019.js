"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7019_PROTOCOL = void 0;
exports.UIID7019_PROTOCOL = {
    uiid: 7019,
    initParams: device => {
        const { battery = 100, water = 0, trigTime } = device.itemData.params;
        return { battery, water, trigTime };
    },
    controlItem: {}
};
