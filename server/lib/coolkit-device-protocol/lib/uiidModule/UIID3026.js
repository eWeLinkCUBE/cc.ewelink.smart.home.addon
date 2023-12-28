"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID3026_PROTOCOL = void 0;
exports.UIID3026_PROTOCOL = {
    uiid: 3026,
    initParams: device => {
        const { battery = 100, lock = 1, trigTime } = device.itemData.params;
        return { battery, lock, trigTime };
    },
    controlItem: {}
};
