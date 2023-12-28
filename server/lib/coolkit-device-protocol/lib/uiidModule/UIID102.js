"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID102_PROTOCOL = void 0;
exports.UIID102_PROTOCOL = {
    uiid: 102,
    initParams: device => {
        const { actionTime, battery = 100, chipID, lastUpdateTime, switch: s = 'on', type = 4 } = device.itemData.params;
        return { actionTime, battery, chipID, lastUpdateTime, switch: s, type };
    },
    controlItem: {}
};
