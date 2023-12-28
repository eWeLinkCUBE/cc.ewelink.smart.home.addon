"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sceneConfig = exports.UIID44_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID44_PROTOCOL = {
    uiid: 44,
    initParams(device) {
        const { brightness = 10, mode = 0, startup = 'on', switch: s = 'off', brightMin = 0, brightMax = 255 } = device.itemData.params;
        return { brightness, mode, startup, switch: s, brightMin, brightMax };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setBrightness(controlItem) {
            const { brightness = 1 } = controlItem;
            return {
                brightness,
                switch: 'on',
                mode: 0
            };
        },
        setLightScene(controlItem) {
            const { sceneType } = controlItem;
            const typeKey = sceneType;
            return { ltype: typeKey, [typeKey]: exports.sceneConfig[typeKey] };
        },
        setSingleStartup: protocol_1.commonSingleStartup
    }
};
exports.sceneConfig = {
    nightLight: {
        mode: 1,
        switch: 'on',
        brightness: 5
    },
    computer: {
        mode: 2,
        switch: 'on',
        brightness: 20
    },
    read: {
        mode: 3,
        switch: 'on',
        brightness: 50
    },
    bright: {
        mode: 4,
        switch: 'on',
        brightness: 100
    }
};
