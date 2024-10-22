"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID191_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID191_PROTOCOL = {
    uiid: 191,
    initParams(device) {
        const { sledOnline = 'on', configure = (0, constant_1.getDefaultStartup)(1, 'off').configure, pulses = (0, constant_1.getDefaultInching)(1, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(1, 'off').switches } = device.itemData.params;
        return { sledOnline, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setMultiStartup: protocol_1.commonMultiStartup,
        setMultiInchingMode: protocol_1.commonMultiInching
    }
};
