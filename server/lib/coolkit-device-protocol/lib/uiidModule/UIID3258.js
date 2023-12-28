"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID3258_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const commonLight_1 = require("../protocol/commonLight");
exports.UIID3258_PROTOCOL = {
    uiid: 3258,
    initParams(device) {
        const { colorMode = 'cct', colorTemp = 100, cctBrightness = 100, rgbBrightness = 100, hue = 0, saturation = 100, switch: s = 'off' } = device.itemData.params;
        return { colorMode, colorTemp, cctBrightness, rgbBrightness, hue, saturation, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonZigbeeBrightness,
        setColorTemperature: protocol_1.commonZigbeeColorTemperature,
        setColor: protocol_1.commonZigbeeColor,
        setLightMode: commonLight_1.commonZigbeeColorMode,
        setMultiLightControl: controlItem => {
            const { brightness, colorTemp, hue, saturation } = controlItem;
            const returnObj = {
                switch: 'on'
            };
            if (typeof colorTemp === 'number' && typeof brightness === 'number') {
                Object.assign(returnObj, {
                    colorTemp,
                    cctBrightness: brightness
                });
            }
            else if (typeof hue === 'number' && typeof brightness === 'number') {
                Object.assign(returnObj, {
                    hue,
                    saturation: typeof saturation === 'number' ? saturation : 100,
                    rgbBrightness: brightness
                });
            }
            return returnObj;
        }
    }
};
