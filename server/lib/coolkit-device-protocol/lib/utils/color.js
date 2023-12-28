"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueByScope = exports.brightTranslate = exports.decToRgb = exports.rgbToDec = exports.hexToRgb = exports.rgbToHex = exports.rgbToHue = exports.hueToRgb = void 0;
const color_convert_1 = __importDefault(require("color-convert"));
function hueToRgb(hue, saturation) {
    const hsv = [hue, typeof saturation === 'number' ? saturation : 100, 100];
    return color_convert_1.default.hsv.rgb(hsv);
}
exports.hueToRgb = hueToRgb;
function rgbToHue(r, g, b) {
    const rgb = [r, g, b];
    return color_convert_1.default.rgb.hsv(rgb);
}
exports.rgbToHue = rgbToHue;
function rgbToHex(r, g, b) {
    const rgb = [r, g, b];
    return `#${color_convert_1.default.rgb.hex(rgb)}`;
}
exports.rgbToHex = rgbToHex;
function hexToRgb(hex) {
    return color_convert_1.default.hex.rgb(hex);
}
exports.hexToRgb = hexToRgb;
function rgbToDec(r, g, b) {
    const rgb = [r, g, b];
    return parseInt(color_convert_1.default.rgb.hex(rgb), 16);
}
exports.rgbToDec = rgbToDec;
function decToRgb(dec) {
    let hex = dec.toString(16);
    const addLength = 6 - hex.length;
    for (let i = 0; i < addLength; i++) {
        hex = '0' + hex;
    }
    return hexToRgb(hex);
}
exports.decToRgb = decToRgb;
function brightTranslate(originBright, source) {
    const sourceRange = source[1] - source[0] + 1;
    let bright = Math.ceil(((originBright - source[0] + 1) / sourceRange) * 100);
    bright < 0 && (bright = 1);
    return bright;
}
exports.brightTranslate = brightTranslate;
function getValueByScope(beforeNum, beforeRange, afterRange) {
    let beforePercent = (beforeNum - beforeRange.min) / (beforeRange.max - beforeRange.min);
    let target = Math.round((afterRange.max - afterRange.min) * beforePercent + afterRange.min);
    if (target > afterRange.max) {
        target = afterRange.max;
    }
    else if (target < afterRange.min) {
        target = afterRange.min;
    }
    return target;
}
exports.getValueByScope = getValueByScope;
