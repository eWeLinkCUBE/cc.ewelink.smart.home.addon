"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID174_PROTOCOL = void 0;
exports.UIID174_PROTOCOL = {
    uiid: 174,
    initParams(device) {
        const { actionTime, bleAddr, outlet, key, count } = device.itemData.params;
        return { actionTime, bleAddr, outlet, key, count };
    },
    controlItem: {}
};
