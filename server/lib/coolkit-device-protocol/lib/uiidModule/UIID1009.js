"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID1009_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID1009_PROTOCOL = {
    uiid: 1009,
    initParams: device => {
        const { switch: s = 'off' } = device.itemData.params;
        return { switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle
    }
};
