"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID1770_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID1770_PROTOCOL = {
    uiid: 1770,
    initParams(device) {
        const { battery = 100, humidity = '', temperature = '', switch: s = 'off', tempUnit = 0 } = device.itemData.params;
        return { battery, humidity, temperature, switch: s, tempUnit };
    },
    controlItem: {
        setTempUnit: protocol_1.commonTempUnit
    }
};
