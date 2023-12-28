"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonZigbeeColorMode = exports.commonZigbeeColor = exports.commonZigbeeColorTemperature = exports.commonZigbeeBrightness = exports.commonWifiColor = exports.commonWifiColorTemperature = exports.commonWifiBrightness = void 0;
const color_1 = require("../utils/color");
function commonWifiBrightness(controlItem) {
    const { device: { params }, brightness = 1 } = controlItem;
    const ltype = params.ltype === 'color' ? 'color' : 'white';
    const ltypeParams = params[`${ltype}`];
    ltypeParams.br = brightness;
    return {
        ltype,
        [ltype]: ltypeParams
    };
}
exports.commonWifiBrightness = commonWifiBrightness;
function commonWifiColorTemperature(controlItem) {
    var _a;
    const { device: { params }, colorTemp } = controlItem;
    const ltype = 'white';
    const ltypeParams = (_a = params[`${ltype}`]) !== null && _a !== void 0 ? _a : { br: 100, ct: 255 };
    ltypeParams.ct = colorTemp;
    return {
        ltype,
        [ltype]: ltypeParams
    };
}
exports.commonWifiColorTemperature = commonWifiColorTemperature;
function commonWifiColor(controlItem) {
    const { device: { params }, hue = 1 } = controlItem;
    const [r, g, b] = (0, color_1.hueToRgb)(hue);
    const ltype = 'color';
    const ltypeParams = params[`${ltype}`];
    ltypeParams.r = r;
    ltypeParams.g = g;
    ltypeParams.b = b;
    return {
        ltype,
        [ltype]: ltypeParams
    };
}
exports.commonWifiColor = commonWifiColor;
function commonZigbeeBrightness(controlItem) {
    const { device: { params, uiid }, brightness = 1 } = controlItem;
    const { colorMode = 'cct' } = params;
    const brightnessKey = [3258, 7009, 20008].includes(uiid) ? `${colorMode}Brightness` : 'brightness';
    return {
        switch: 'on',
        [brightnessKey]: brightness
    };
}
exports.commonZigbeeBrightness = commonZigbeeBrightness;
function commonZigbeeColorTemperature(controlItem) {
    const { colorTemp = 100 } = controlItem;
    return {
        switch: 'on',
        colorTemp
    };
}
exports.commonZigbeeColorTemperature = commonZigbeeColorTemperature;
function commonZigbeeColor(controlItem) {
    const { hue, saturation } = controlItem;
    return { switch: 'on', hue, saturation: typeof saturation === 'number' ? saturation : 100 };
}
exports.commonZigbeeColor = commonZigbeeColor;
function commonZigbeeColorMode(controlItem) {
    var _a;
    const { device: { params, uiid }, colorMode = 'cct' } = controlItem;
    const { colorTemp = 100, hue, saturation } = params;
    const brightness = (_a = params[`${colorMode}Brightness`]) !== null && _a !== void 0 ? _a : 100;
    const resp = { switch: 'on' };
    if (uiid === 7008 || uiid === 7009) {
        Object.assign(resp, { ltype: 'normal' });
    }
    if (colorMode === 'cct') {
        Object.assign(resp, {
            cctBrightness: brightness,
            colorTemp,
            colorMode: 'cct'
        });
    }
    else {
        Object.assign(resp, {
            rgbBrightness: brightness,
            colorMode: 'rgb',
            hue,
            saturation
        });
    }
    return resp;
}
exports.commonZigbeeColorMode = commonZigbeeColorMode;
