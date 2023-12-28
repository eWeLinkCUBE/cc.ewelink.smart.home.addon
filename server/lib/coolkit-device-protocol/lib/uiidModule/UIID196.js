"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID196_PROTOCOL = void 0;
const color_1 = require("../utils/color");
exports.UIID196_PROTOCOL = {
    uiid: 196,
    initParams(device) {
        const { brightness = 50, color = { spectrumRGB: 16721680 }, on = true } = device.itemData.params;
        return { brightness, color, on };
    },
    controlItem: {
        toggle(controlItem) {
            const { device: { params: { on } } } = controlItem;
            return {
                capability: 'action.devices.commands.OnOff',
                execParams: {
                    on: !on
                }
            };
        },
        setBrightness(controlItem) {
            const { brightness = 1 } = controlItem;
            return {
                capability: 'action.devices.commands.BrightnessAbsolute',
                execParams: {
                    brightness
                }
            };
        },
        setColor(controlItem) {
            const { hue = 360 } = controlItem;
            const [r, g, b] = (0, color_1.hueToRgb)(hue);
            const spectrumRGB = (0, color_1.rgbToDec)(r, g, b);
            return {
                capability: 'action.devices.commands.ColorAbsolute',
                execParams: {
                    color: {
                        spectrumRGB
                    }
                }
            };
        }
    }
};
