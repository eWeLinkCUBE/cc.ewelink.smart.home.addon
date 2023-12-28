"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID32_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID32_PROTOCOL = {
    uiid: 32,
    initParams(device) {
        const { power = '0', voltage = '', current = '', pulse = 'off', pulseWidth = 500, sledOnline = 'on', startup = 'off', switch: s = 'off' } = device.itemData.params;
        return { power, voltage, current, pulse, pulseWidth, sledOnline, startup, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setSingleInchingMode: protocol_1.commonSingleInching,
        setSingleStartup: protocol_1.commonSingleStartup,
        refreshPowerInfo() {
            return { uiActive: 60 };
        },
        getHistoryPower() {
            return { hundredDaysKwh: 'get' };
        }
    }
};
