"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7005_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID7005_PROTOCOL = {
    uiid: 7005,
    initParams: device => {
        const { switch: s = 'off', subOtaInfo } = device.itemData.params;
        return { switch: s, subOtaInfo };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle
    }
};
