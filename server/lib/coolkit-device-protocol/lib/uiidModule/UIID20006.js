"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID20006_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID20006_PROTOCOL = {
    uiid: 20006,
    initParams(device) {
        const { brightness = 100, switch: s = 'on' } = device.itemData.params;
        return { brightness, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonZigbeeBrightness
    }
};
