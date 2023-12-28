"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID20005_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID20005_PROTOCOL = {
    uiid: 20005,
    initParams(device) {
        const { switch: s = 'on' } = device.itemData.params;
        return { switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle
    }
};
