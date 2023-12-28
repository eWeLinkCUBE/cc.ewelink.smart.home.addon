"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID163_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID163_PROTOCOL = {
    uiid: 163,
    initParams(device) {
        const { offBrightness = 10, sledOnline = 'on', configure = (0, constant_1.getDefaultStartup)(4, 'off').configure, pulses = (0, constant_1.getDefaultInching)(4, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return { offBrightness, sledOnline, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setMultiInchingMode(controlItem) {
            return (0, protocol_1.commonMultiInching)(controlItem, 1000);
        },
        setMultiStartup: protocol_1.commonMultiStartup,
        setSledOnline: protocol_1.commonSledOnline
    }
};
