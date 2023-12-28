"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID2256_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID2256_PROTOCOL = {
    uiid: 2256,
    initParams(device) {
        const { switches = (0, constant_1.getDefaultSwitches)(2, 'off').switches } = device.itemData.params;
        return { switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle
    }
};
