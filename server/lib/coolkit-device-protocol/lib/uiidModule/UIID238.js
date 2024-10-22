"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID238_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID238_PROTOCOL = {
    uiid: 238,
    initParams(device) {
        const { sledOnline = 'on', switches = (0, constant_1.getDefaultSwitches)(3, 'off').switches, doorsensors = {}, ASYN_RESP, alarm = true } = device.itemData.params;
        return { sledOnline, switches, doorsensors, ASYN_RESP, alarm };
    },
    controlItem: {
        toggle: controlItem => {
            const { outlet = 0, switch: state = 'off' } = controlItem;
            if (outlet === 'all') {
                return Object.assign(Object.assign({}, (0, constant_1.getDefaultSwitches)(3, state)), { NO_SAVE_DB: true, ASYN_RESP: {}, source: 'app' });
            }
            const switches = [{ switch: state, outlet }];
            return { switches, NO_SAVE_DB: true, ASYN_RESP: {}, source: 'app' };
        },
        setSledOnline: protocol_1.commonSledOnline,
        setAlarm(controlItem) {
            const { alarm = true } = controlItem;
            return { alarm };
        }
    }
};
