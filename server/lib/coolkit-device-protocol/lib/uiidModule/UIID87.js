"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID87_PROTOCOL = void 0;
exports.UIID87_PROTOCOL = {
    uiid: 87,
    initParams: device => {
        const { partnerDevice = {} } = device.itemData.params;
        return { partnerDevice };
    },
    controlItem: {}
};
