"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID1258_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID1258_PROTOCOL = {
    uiid: 1258,
    initParams(device) {
        const { brightness = 100, colorTemp = 100, switch: s = 'off' } = device.itemData.params;
        return { brightness, colorTemp, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonZigbeeBrightness,
        setColorTemperature: protocol_1.commonZigbeeColorTemperature
    }
};
