"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID30001_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID30001_PROTOCOL = {
    uiid: 30001,
    initParams(device) {
        const { colorMode = 0, colorTempPhysicalMinMireds = 1, colorTempPhysicalMaxMireds = 254, colorTemperatureMireds = 254, currentHue = 0, currentSaturation = 5, currentX = 0, currentY = 0, minLevel = 1, maxLevel = 254, currentLevel = 254, switch: s = 'off' } = device.itemData.params;
        return {
            colorMode,
            colorTempPhysicalMinMireds,
            colorTempPhysicalMaxMireds,
            colorTemperatureMireds,
            currentHue,
            currentSaturation,
            currentX,
            currentY,
            minLevel,
            maxLevel,
            currentLevel,
            switch: s
        };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: controlItem => {
            const { device: { params }, brightness = 1 } = controlItem;
            const { minLevel = 0, maxLevel = 254 } = params;
            let currentLevel = parseInt((brightness / 100) * (maxLevel - minLevel) + '') + minLevel;
            currentLevel < minLevel && (currentLevel = minLevel);
            return {
                currentLevel,
                minLevel,
                maxLevel
            };
        },
        setColorTemperature: controlItem => {
            const { device: { params }, colorTemp = 1 } = controlItem;
            const { colorTempPhysicalMinMireds = 1, colorTempPhysicalMaxMireds = 254 } = params;
            return {
                colorTemperatureMireds: colorTemp,
                colorTempPhysicalMinMireds,
                colorTempPhysicalMaxMireds
            };
        },
        setColor: controlItem => {
            const { hue = 0, saturation } = controlItem;
            const currentHue = (hue / 360) * 255;
            return { currentHue, currentSaturation: typeof saturation === 'number' ? saturation : 254 };
        },
        setLightMode: controlItem => {
            const { device: { params }, colorMode = 'rgb' } = controlItem;
            const { colorTemperatureMireds, currentHue, currentSaturation } = params;
            const result = { colorMode: colorMode === 'cct' ? 2 : 0 };
            if (colorMode === 'cct') {
                Object.assign(result, { colorTemperatureMireds });
            }
            else if (colorMode === 'rgb') {
                Object.assign(result, { currentHue, currentSaturation });
            }
            return result;
        }
    }
};
