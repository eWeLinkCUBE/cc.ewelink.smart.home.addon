"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneConfig = exports.UIID136_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID136_PROTOCOL = {
    uiid: 136,
    initParams(device) {
        const { ltype = 'white', switch: s = 'off', white = { br: 50, ct: 50 }, color, bright, goodNight, read, nightLight, party, leisure, soft, colorful } = device.itemData.params;
        return { ltype, switch: s, white, color, bright, goodNight, read, nightLight, party, leisure, soft, colorful };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonWifiBrightness,
        setColorTemperature: protocol_1.commonWifiColorTemperature,
        setColor: protocol_1.commonWifiColor,
        setLightMode: controlItem => {
            var _a, _b;
            const { colorMode = 'cct', device: { params } } = controlItem;
            const typeKey = colorMode === 'cct' ? 'white' : 'color';
            const colorConfig = { r: 255, g: 0, b: 0, br: (_a = params.white) === null || _a === void 0 ? void 0 : _a.br };
            return { ltype: typeKey, [typeKey]: (_b = params[typeKey]) !== null && _b !== void 0 ? _b : colorConfig };
        },
        setLightScene(controlItem) {
            const { sceneType } = controlItem;
            const typeKey = sceneType;
            return { ltype: typeKey, [typeKey]: exports.sceneConfig[typeKey] };
        },
        setBrightAdjust(controlItem) {
            const { brightAdjust = '+' } = controlItem;
            return { brightAdjust };
        },
        setColorTempAdjust(controlItem) {
            const { ColourTempAdjust = '+' } = controlItem;
            return { ColourTempAdjust };
        }
    }
};
exports.sceneConfig = {
    bright: {
        r: 255,
        g: 255,
        b: 255,
        br: 100
    },
    goodNight: {
        r: 255,
        g: 250,
        b: 125,
        br: 25
    },
    read: {
        r: 255,
        g: 255,
        b: 255,
        br: 60
    },
    nightLight: {
        r: 255,
        g: 240,
        b: 225,
        br: 5
    },
    party: {
        r: 254,
        g: 132,
        b: 0,
        br: 45,
        tf: 1,
        sp: 1
    },
    leisure: {
        r: 0,
        g: 40,
        b: 254,
        br: 55,
        tf: 1,
        sp: 1
    },
    soft: {
        r: 38,
        g: 254,
        b: 0,
        br: 20,
        tf: 1,
        sp: 1
    },
    colorful: {
        r: 255,
        g: 0,
        b: 0,
        br: 100,
        tf: 1,
        sp: 1
    }
};
