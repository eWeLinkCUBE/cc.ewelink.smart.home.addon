"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7013_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID7013_PROTOCOL = {
    uiid: 7013,
    initParams(device) {
        const { backlight = 'on', subOtaInfo, configure = (0, constant_1.getDefaultStartup)(4, 'off').configure, pulses = (0, constant_1.getDefaultInching)(4, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return { backlight, configure, pulses, switches, subOtaInfo };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup,
        setBackLight: protocol_1.commonBackLight
    }
};
