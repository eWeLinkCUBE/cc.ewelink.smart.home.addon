"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID133_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID133_PROTOCOL = {
    uiid: 133,
    initParams(device) {
        const { lock = 0, tempUnit = 0, tempCorrection = 0, temperature, humidity, sDeviceid, tempsource, configure = (0, constant_1.getDefaultStartup)(2, 'off').configure, pulses = (0, constant_1.getDefaultInching)(2, 'off', 1000).pulses, switches = (0, constant_1.getDefaultSwitches)(2, 'off').switches } = device.itemData.params;
        return { lock, tempUnit, tempCorrection, temperature, humidity, sDeviceid, tempsource, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup,
        setLock: protocol_1.commonLock,
        setTempUnit: protocol_1.commonTempUnit
    }
};
