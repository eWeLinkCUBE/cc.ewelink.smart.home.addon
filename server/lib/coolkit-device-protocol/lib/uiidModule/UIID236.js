"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID236_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
const constant_1 = require("../constant");
exports.UIID236_PROTOCOL = {
    uiid: 236,
    initParams(device) {
        const { sledOnline = 'on', switches = (0, constant_1.getDefaultSwitches)(2, 'off').switches, doorsensors = {}, ASYN_RESP, alarm = true } = device.itemData.params;
        return { sledOnline, switches, doorsensors, ASYN_RESP, alarm };
    },
    controlItem: {
        toggle: controlItem => {
            const { switch: state = 'off' } = controlItem;
            const outlet = controlItem.outlet;
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
