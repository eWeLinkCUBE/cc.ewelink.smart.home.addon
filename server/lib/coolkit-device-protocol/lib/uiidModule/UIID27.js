"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID27_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID27_PROTOCOL = {
    uiid: 27,
    initParams: (device) => {
        const { startup = 'off', switch: s = 'off' } = device.itemData.params;
        return { startup, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSingleStartup: protocol_1.commonSingleStartup
    }
};
