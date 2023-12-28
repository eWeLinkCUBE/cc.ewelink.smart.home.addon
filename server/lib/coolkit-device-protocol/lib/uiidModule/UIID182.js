"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID182_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID182_PROTOCOL = {
    uiid: 182,
    initParams: device => {
        const { configure = [{ outlet: 0, startup: 'off' }], pulses = [{ pulse: 'off', switch: 'off', width: 1000, outlet: 0 }], sledOnline = 'on', power, appPower, reactPower, voltage, current, dayKwh, switches = [{ switch: 'on', outlet: 0 }] } = device.itemData.params;
        return { configure, pulses, sledOnline, power, appPower, reactPower, voltage, current, dayKwh, switches };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setMultiStartup: protocol_1.commonMultiStartup,
        setMultiInchingMode: protocol_1.commonMultiInching,
        refreshPowerInfo() {
            return { uiActive: 60 };
        },
        getHistoryPower() {
            return { hundredDaysKwh: 'get' };
        }
    }
};
