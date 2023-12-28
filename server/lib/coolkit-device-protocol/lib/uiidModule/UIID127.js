"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID127_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID127_PROTOCOL = {
    uiid: 127,
    initParams(device) {
        const { childLock = 'off', fault = 0, switch: s, temperature, volatility, targetTemp, workMode, tempScale, workState = 1 } = device.itemData.params;
        return { childLock, fault, switch: s, temperature, volatility, targetTemp, workMode, tempScale, workState };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setTempUnit: protocol_1.commonTempUnit,
        setTargetTemp(controlItem) {
            const { targetTemp = 20 } = controlItem;
            return { targetTemp };
        },
        setWorkMode(controlItem) {
            const { workMode = 1 } = controlItem;
            return { workMode };
        },
        setChildLock(controlItem) {
            const { childLock = 'off' } = controlItem;
            return { childLock };
        }
    }
};
