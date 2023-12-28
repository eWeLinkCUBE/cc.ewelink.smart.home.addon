"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID65_PROTOCOL = void 0;
exports.UIID65_PROTOCOL = {
    uiid: 65,
    initParams: device => {
        const { battery = 100, direction = 1, partnerDevice } = device.itemData.params;
        return { battery, direction, partnerDevice };
    },
    controlItem: {}
};
