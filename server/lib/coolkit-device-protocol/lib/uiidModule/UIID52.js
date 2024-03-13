"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID52_PROTOCOL = void 0;
exports.UIID52_PROTOCOL = {
    uiid: 52,
    initParams(device) {
        const { state = 'off', channel0 = '10', channel1 = '0' } = device.itemData.params;
        return { state, channel0, channel1 };
    },
    controlItem: {
        toggle(controlItem) {
            const { device: { params }, switch: state } = controlItem;
            if (state) {
                return { state };
            }
            return params.state === 'on' ? { state: 'off' } : { state: 'on' };
        },
        setBrightness(controlItem) {
            const { brightness = 1 } = controlItem;
            return {
                channel0: `${brightness}`
            };
        },
        setColorTemperature(controlItem) {
            const { colorTemp } = controlItem;
            return {
                channel1: `${colorTemp}`
            };
        },
        setMultiLightControl(controlItem) {
            const { brightness, colorTemp } = controlItem;
            const returnObj = {};
            if (typeof brightness === 'number') {
                Object.assign(returnObj, { channel0: `${brightness}` });
            }
            if (typeof colorTemp === 'number') {
                Object.assign(returnObj, { channel1: `${colorTemp}` });
            }
            return returnObj;
        }
    }
};
