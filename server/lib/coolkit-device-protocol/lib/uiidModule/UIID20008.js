"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID20008_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const commonLight_1 = require("../protocol/commonLight");
exports.UIID20008_PROTOCOL = {
    uiid: 20008,
    initParams(device) {
        const { colorMode = 'cct', colorTemp = 100, cctBrightness = 100, rgbBrightness = 100, hue = 0, saturation = 100, switch: s = 'off' } = device.itemData.params;
        return { colorMode, colorTemp, cctBrightness, rgbBrightness, hue, saturation, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonZigbeeBrightness,
        setColorTemperature: protocol_1.commonZigbeeColorTemperature,
        setColor: protocol_1.commonZigbeeColor,
        setLightMode: commonLight_1.commonZigbeeColorMode
    }
};
