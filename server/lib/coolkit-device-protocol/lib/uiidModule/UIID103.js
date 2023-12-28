"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID103_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID103_PROTOCOL = {
    uiid: 103,
    initParams(device) {
        const { ltype = 'white', switch: s = 'off', white = { br: 50, ct: 113 }, bright, read, computer, nightLight } = device.itemData.params;
        return { ltype, switch: s, white, bright, read, computer, nightLight };
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
            const config = typeKey === 'white' ? params[typeKey] : sceneConfig[typeKey];
            return { ltype: typeKey, [typeKey]: config };
        }
    }
};
const sceneConfig = {
    bright: {
        br: 100,
        ct: 255
    },
    read: {
        br: 50,
        ct: 0
    },
    computer: {
        br: 20,
        ct: 255
    },
    nightLight: {
        br: 5,
        ct: 0
    }
};
