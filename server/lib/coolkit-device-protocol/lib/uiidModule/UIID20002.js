"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID20002_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID20002_PROTOCOL = {
    uiid: 20002,
    initParams: device => {
        const { switches = (0, constant_1.getDefaultSwitches)(2, 'off').switches } = device.itemData.params;
        return { switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle
    }
};
