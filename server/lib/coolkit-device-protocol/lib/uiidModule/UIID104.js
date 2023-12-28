"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID104_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID104_PROTOCOL = {
    uiid: 104,
    initParams(device) {
        const { ltype = 'white', switch: s = 'off', white = { br: 50, ct: 113 }, color, bright, goodNight, read, nightLight, party, leisure, soft, colorful } = device.itemData.params;
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
        setLightScene: (controlItem) => {
            const { sceneType } = controlItem;
            const typeKey = sceneType;
            return { ltype: typeKey, [typeKey]: sceneConfig[typeKey] };
        }
    }
};
const sceneConfig = {
    bright: {
        br: 100,
        r: 255,
        g: 255,
        b: 255
    },
    goodNight: {
        br: 25,
        r: 255,
        g: 254,
        b: 127
    },
    read: {
        br: 60,
        r: 255,
        g: 255,
        b: 255
    },
    nightLight: {
        br: 5,
        r: 255,
        g: 242,
        b: 226
    },
    party: {
        br: 45,
        r: 254,
        g: 132,
        b: 0,
        tf: 1,
        sp: 1
    },
    leisure: {
        br: 55,
        r: 0,
        g: 40,
        b: 254,
        tf: 1,
        sp: 1
    },
    soft: {
        br: 20,
        r: 38,
        g: 254,
        b: 0,
        tf: 1,
        sp: 1
    },
    colorful: {
        br: 100,
        r: 255,
        g: 0,
        b: 0,
        tf: 1,
        sp: 1
    }
};
