"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID107_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID107_PROTOCOL = {
    uiid: 107,
    initParams: device => {
        const { sledOnline = 'on', configure = (0, constant_1.getDefaultStartup)(4, 'off').configure, pulses = (0, constant_1.getDefaultInching)(4, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return { sledOnline, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup
    }
};
