"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7014_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID7014_PROTOCOL = {
    uiid: 7014,
    initParams(device) {
        const { battery = 100, humidity = '', temperature = '', tempUnit = 0, trigTime, tempComfortLower = '1900', tempComfortUpper = '2700', humiComfortLower = '4000', humiComfortUpper = '6000', subOtaInfo } = device.itemData.params;
        return { battery, humidity, temperature, tempUnit, trigTime, tempComfortLower, tempComfortUpper, humiComfortLower, humiComfortUpper, subOtaInfo };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setMultiInchingMode: protocol_1.commonMultiInching,
        setMultiStartup: protocol_1.commonMultiStartup,
        setBackLight: protocol_1.commonBackLight,
        setTempUnit: protocol_1.commonTempUnit
    }
};
