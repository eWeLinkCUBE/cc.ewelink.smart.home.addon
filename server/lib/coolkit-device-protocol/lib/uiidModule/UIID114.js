"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID114_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID114_PROTOCOL = {
    uiid: 114,
    initParams(device) {
        const { lock = 0, senMode, savMode, alertMode, alert, sledOnline = 'on', configure = (0, constant_1.getDefaultStartup)(4, 'off').configure, pulses = (0, constant_1.getDefaultInching)(4, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return { lock, senMode, savMode, alertMode, alert, sledOnline, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setLock: protocol_1.commonLock,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup,
        setSledOnline: protocol_1.commonSledOnline
    }
};
