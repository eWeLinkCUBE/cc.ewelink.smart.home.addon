"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID181_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID181_PROTOCOL = {
    uiid: 181,
    initParams: device => {
        const { autoControl = [], autoControlEnabled = 0, currentHumidity = 'unavailable', currentTemperature = 'unavailable', pulseConfig = { pulse: 'off', switch: 'off', pulseWidth: 500 }, sensorType = '', sledOnline = 'on', startup = 'off', switch: s = 'off', tempUnit = 0 } = device.itemData.params;
        return { autoControl, autoControlEnabled, currentHumidity, currentTemperature, pulseConfig, sensorType, sledOnline, startup, switch: s, tempUnit };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setSingleInchingMode(controlItem) {
            var _a;
            const { device: { params }, width = 500, switch: _switch, pulse = 'on' } = controlItem;
            const pulseConfig = (_a = params.pulseConfig) !== null && _a !== void 0 ? _a : {
                pulse: 'on',
                switch: 'on',
                pulseWidth: 500
            };
            pulseConfig.pulseWidth = width;
            pulseConfig.pulse = pulse;
            if (_switch) {
                pulseConfig.switch = _switch;
            }
            return { pulseConfig };
        },
        setSingleStartup: protocol_1.commonSingleStartup,
        setTempUnit: protocol_1.commonTempUnit,
        autoControl(controlItem) {
            const { device: { params: { autoControlEnabled } } } = controlItem;
            return {
                autoControlEnabled: autoControlEnabled ? 0 : 1
            };
        }
    }
};
