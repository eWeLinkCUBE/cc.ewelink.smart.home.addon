"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneConfig = exports.UIID7009_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const commonLight_1 = require("../protocol/commonLight");
exports.UIID7009_PROTOCOL = {
    uiid: 7009,
    initParams(device) {
        const { colorMode = 'cct', colorTemp = 0, cctBrightness = 100, rgbBrightness = 100, hue = 0, saturation = 100, ltype = 'normal', slowlyDimmed = 500, slowlyLit = 500, startup = 'on', switch: s = 'off', subOtaInfo, startupDiy } = device.itemData.params;
        return { colorMode, colorTemp, cctBrightness, rgbBrightness, hue, saturation, ltype, slowlyDimmed, slowlyLit, startup, switch: s, subOtaInfo, startupDiy };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSingleStartup(controlItem) {
            const { startup = 'on', device: { params: { startupDiy = {} } } } = controlItem;
            if (startup === 'diy')
                return { startup, startupDiy };
            return { startup };
        },
        setBrightness: protocol_1.commonZigbeeBrightness,
        setColorTemperature: protocol_1.commonZigbeeColorTemperature,
        setColor: protocol_1.commonZigbeeColor,
        setLightMode: commonLight_1.commonZigbeeColorMode,
        setSlowly(controlItem) {
            const { slowlyLit, slowlyDimmed } = controlItem;
            if (typeof slowlyLit === 'number') {
                return { slowlyLit };
            }
            else {
                return { slowlyDimmed: slowlyDimmed };
            }
        },
        setToggle(controlItem) {
            const { dimming, quickSwitch } = controlItem;
            return { dimming: dimming, quickSwitch: quickSwitch };
        },
        setMultiLightControl: controlItem => {
            const { brightness, colorTemp, hue, saturation, device: { params: { colorMode, cctBrightness, rgbBrightness } } } = controlItem;
            const returnObj = {
                switch: 'on'
            };
            let originMode = colorMode;
            if (typeof colorTemp === 'number') {
                Object.assign(returnObj, {
                    colorTemp,
                    cctBrightness
                });
                originMode = 'cct';
            }
            else if (typeof hue === 'number') {
                Object.assign(returnObj, {
                    hue,
                    saturation: typeof saturation === 'number' ? saturation : 100,
                    rgbBrightness
                });
                originMode = 'rgb';
            }
            if (typeof brightness === 'number') {
                originMode === 'cct' && Object.assign(returnObj, { cctBrightness: brightness });
                originMode === 'rgb' && Object.assign(returnObj, { rgbBrightness: brightness });
            }
            return returnObj;
        }
    }
};
exports.sceneConfig = {
    bright: {
        br: 100,
        ct: 100
    },
    read: {
        br: 100,
        ct: 50
    },
    computer: {
        br: 80,
        ct: 100
    },
    nightLight: {
        br: 1,
        ct: 50
    },
    partyRGB: {
        br: 60,
        tf: 3,
        sp: 60,
        colorList: [
            { hue: 0, saturation: 100 },
            { hue: 180, saturation: 100 },
            { hue: 60, saturation: 100 },
            { hue: 120, saturation: 100 }
        ]
    },
    leisureRGB: {
        br: 60,
        tf: 2,
        sp: 40,
        colorList: [
            { hue: 47, saturation: 100 },
            { hue: 295, saturation: 100 },
            { hue: 178, saturation: 100 }
        ]
    },
    softRGB: {
        br: 60,
        tf: 2,
        sp: 30,
        colorList: [
            { hue: 46, saturation: 100 },
            { hue: 180, saturation: 100 },
            { hue: 318, saturation: 100 }
        ]
    },
    colorfulRGB: {
        br: 60,
        tf: 3,
        sp: 60,
        colorList: [
            { hue: 25, saturation: 100 },
            { hue: 60, saturation: 100 },
            { hue: 186, saturation: 100 },
            { hue: 302, saturation: 100 }
        ]
    }
};
