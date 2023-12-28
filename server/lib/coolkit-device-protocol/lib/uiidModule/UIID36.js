"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID36_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID36_PROTOCOL = {
    uiid: 36,
    initParams(device) {
        const { bright = 22, switch: s = 'off' } = device.itemData.params;
        return { bright, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness(controlItem) {
            const { brightness } = controlItem;
            let bright = parseInt((brightness / 100) * 91 + '') + 10;
            bright > 100 && (bright = 100);
            return { bright };
        },
        setMultiLightControl: controlItem => {
            const { brightness } = controlItem;
            const returnObj = {
                switch: 'on'
            };
            if (typeof brightness === 'number') {
                let bright = parseInt((brightness / 100) * 91 + '') + 10;
                bright > 100 && (bright = 100);
                Object.assign(returnObj, {
                    bright
                });
            }
            return returnObj;
        }
    }
};
