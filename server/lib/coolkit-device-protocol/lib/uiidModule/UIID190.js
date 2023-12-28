"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID190_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID190_PROTOCOL = {
    uiid: 190,
    initParams(device) {
        const { sledOnline = 'on', dayKwh = 0, monthKwh = 0, power = 0, current = 0, voltage = 0, configure = (0, constant_1.getDefaultStartup)(1, 'off').configure, pulses = (0, constant_1.getDefaultInching)(1, 'off').pulses, switches = (0, constant_1.getDefaultSwitches)(1, 'off').switches } = device.itemData.params;
        return { sledOnline, dayKwh, monthKwh, power, current, voltage, configure, pulses, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setMultiStartup: protocol_1.commonMultiStartup,
        setMultiInchingMode: protocol_1.commonMultiInching,
        refreshPowerInfo() {
            return { uiActive: 60 };
        },
        getHistoryPower(controlItem) {
            const { start = 0, end = 0 } = controlItem;
            return {
                getHoursKwh: { start, end }
            };
        }
    }
};
