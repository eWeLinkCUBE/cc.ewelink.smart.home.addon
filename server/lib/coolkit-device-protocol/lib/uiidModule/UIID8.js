"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID8_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID8_PROTOCOL = {
    uiid: 8,
    initParams(device) {
        const { lock = 0, sledOnline = 'on', configure = (0, constant_1.getDefaultStartup)(3, 'off').configure, pulses = (0, constant_1.getDefaultInching)(3, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(3, 'off').switches } = device.itemData.params;
        return { lock, sledOnline, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setLock: protocol_1.commonLock,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup,
        setSledOnline: protocol_1.commonSledOnline
    }
};
