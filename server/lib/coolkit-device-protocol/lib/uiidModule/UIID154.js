"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID154_PROTOCOL = void 0;
exports.UIID154_PROTOCOL = {
    uiid: 154,
    initParams: device => {
        const { actionTime, battery = 100, chipid, defense = 1, switch: s = 'on', type = 2 } = device.itemData.params;
        return { actionTime, battery, chipid, defense, switch: s, type };
    },
    controlItem: {}
};
