"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneConfig = exports.UIID135_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID135_PROTOCOL = {
    uiid: 135,
    initParams(device) {
        const { ltype = 'white', slowlyDimmed = 100, slowlyLit = 100, startup = 'on', switch: s = 'off', white = { br: 50, ct: 50 }, bright, read, computer, nightLight } = device.itemData.params;
        return { ltype, slowlyDimmed, slowlyLit, startup, switch: s, white, bright, read, computer, nightLight };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness: protocol_1.commonWifiBrightness,
        setColorTemperature: protocol_1.commonWifiColorTemperature,
        setLightMode: controlItem => {
            const { device: { params: { white } } } = controlItem;
            return { ltype: 'white', white };
        },
        setLightScene: (controlItem) => {
            const { sceneType, device: { params } } = controlItem;
            const typeKey = sceneType;
            const config = typeKey === 'white' ? params[typeKey] : exports.sceneConfig[typeKey];
            return { ltype: typeKey, [typeKey]: config };
        },
        setSlowly(controlItem) {
            const { slowlyLit, slowlyDimmed } = controlItem;
            if (typeof slowlyLit === 'number') {
                return { slowlyLit };
            }
            else {
                return { slowlyDimmed: slowlyDimmed };
            }
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
        br: 100,
        ct: 100
    },
    read: {
        br: 50,
        ct: 0
    },
    computer: {
        br: 20,
        ct: 100
    },
    nightLight: {
        br: 5,
        ct: 0
    }
};
