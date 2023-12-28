"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID140_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID140_PROTOCOL = {
    uiid: 140,
    initParams(device) {
        const { backlight = 'on', lock = 0, sledOnline = 'on', configure = (0, constant_1.getDefaultStartup)(4, 'off').configure, pulses = (0, constant_1.getDefaultInching)(4, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return { backlight, lock, sledOnline, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setLock: protocol_1.commonLock,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup,
        setSledOnline: protocol_1.commonSledOnline
    }
};
