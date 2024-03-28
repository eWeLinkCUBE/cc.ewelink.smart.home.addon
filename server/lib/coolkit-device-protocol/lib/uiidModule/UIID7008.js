"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneConfig = exports.UIID7008_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const commonLight_1 = require("../protocol/commonLight");
exports.UIID7008_PROTOCOL = {
    uiid: 7008,
    initParams(device) {
        const { brightness = 100, colorTemp = 0, ltype = 'normal', startup = 'on', slowlyDimmed = 500, slowlyLit = 500, switch: s = 'off', dimming = 0, quickSwitch = 0, subOtaInfo, startupDiy } = device.itemData.params;
        return { brightness, colorTemp, ltype, slowlyDimmed, slowlyLit, startup, switch: s, dimming, quickSwitch, subOtaInfo, startupDiy };
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
    }
};
