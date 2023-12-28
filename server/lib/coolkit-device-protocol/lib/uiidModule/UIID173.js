"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID173_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const color_1 = require("../utils/color");
exports.UIID173_PROTOCOL = {
    uiid: 173,
    initParams(device) {
        const { bright = 100, colorTemp = 50, colorR = 255, colorG = 255, colorB = 0, light_type = 1, mode = 1, switch: s = 'on' } = device.itemData.params;
        return { bright, colorTemp, colorR, colorG, colorB, light_type, mode, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness(controlItem) {
            const { brightness, mode, device: { params: { mode: originMode = 1, colorR, colorG, colorB } } } = controlItem;
            let currentMode = 1;
            if (!mode && typeof mode !== 'number') {
                currentMode = originMode;
            }
            else if (mode === 'cct') {
                currentMode = 2;
            }
            else if (mode === 'white') {
                currentMode = 3;
            }
            else if (typeof mode === 'number') {
                currentMode = mode;
            }
            return { switch: 'on', bright: brightness, mode: currentMode, colorR, colorG, colorB };
        },
        setColorTemperature(controlItem) {
            const { device: { params: { bright = 100 } }, colorTemp } = controlItem;
            return { colorTemp: colorTemp, mode: 2, bright };
        },
        setColor(controlItem) {
            const { device: { params: { bright = 100 } }, hue = 0, saturation } = controlItem;
            const [r, g, b] = (0, color_1.hueToRgb)(hue, saturation);
            return { colorR: r, colorG: g, colorB: b, mode: 1, bright };
        },
        setLightMode(controlItem) {
            const { device: { params: { bright, colorR, colorG, colorB } }, colorMode } = controlItem;
            const mode = colorMode === 'rgb' ? 1 : colorMode === 'cct' ? 2 : 3;
            return {
                mode,
                switch: 'on',
                bright,
                colorR,
                colorG,
                colorB
            };
        },
        setMultiLightControl(controlItem) {
            const { brightness, colorTemp, hue, saturation, mode } = controlItem;
            const returnObj = {
                switch: 'on',
                mode: 1
            };
            if (typeof brightness === 'number') {
                Object.assign(returnObj, { bright: brightness });
            }
            if (typeof colorTemp === 'number') {
                Object.assign(returnObj, { colorTemp, mode: 2 });
            }
            if (typeof hue === 'number') {
                const [r, g, b] = (0, color_1.hueToRgb)(hue, saturation);
                Object.assign(returnObj, {
                    colorR: r,
                    colorG: g,
                    colorB: b,
                    mode: 1
                });
            }
            if (typeof mode === 'string' || typeof mode === 'number') {
                mode === 'cct' && (returnObj.mode = 2);
                mode === 'rgb' && (returnObj.mode = 1);
                typeof mode === 'number' && (returnObj.mode = mode);
            }
            return returnObj;
        }
    }
};
