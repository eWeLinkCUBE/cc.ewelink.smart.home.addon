"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID177_PROTOCOL = void 0;
exports.UIID177_PROTOCOL = {
    uiid: 177,
    initParams(device) {
        const { actionTime, bleAddr, outlet, key, count } = device.itemData.params;
        return { actionTime, bleAddr, outlet, key, count };
    },
    controlItem: {}
};
