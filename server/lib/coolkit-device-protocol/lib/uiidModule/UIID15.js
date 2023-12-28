"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID15_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID15_PROTOCOL = {
    uiid: 15,
    initParams: device => {
        const { currentHumidity = 'unavailable', currentTemperature = 'unavailable', deviceType = 'normal', mainSwitch = '', pulse = 'off', pulseWidth = 500, sensorType = '', sledOnline = 'on', startup = 'off', switch: s = 'off' } = device.itemData.params;
        return { currentHumidity, currentTemperature, deviceType, mainSwitch, pulse, pulseWidth, sensorType, sledOnline, startup, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setSingleInchingMode: protocol_1.commonSingleInching,
        setSingleStartup: protocol_1.commonSingleStartup
    }
};
