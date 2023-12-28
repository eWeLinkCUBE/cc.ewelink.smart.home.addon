"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID1257_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID1257_PROTOCOL = {
    uiid: 1257,
    initParams(device) {
        const { brightness = 100, switch: s = 'on' } = device.itemData.params;
        return { brightness, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonZigbeeBrightness
    }
};
