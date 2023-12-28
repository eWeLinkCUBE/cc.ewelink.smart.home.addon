"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID6_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID6_PROTOCOL = {
    uiid: 6,
    initParams: (device) => {
        const { pulse = 'off', pulseWidth = 500, sledOnline = 'on', startup = 'off', switch: s = 'off' } = device.itemData.params;
        return { pulse, pulseWidth, sledOnline, startup, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setSingleInchingMode: protocol_1.commonSingleInching,
        setSingleStartup: protocol_1.commonSingleStartup
    }
};
