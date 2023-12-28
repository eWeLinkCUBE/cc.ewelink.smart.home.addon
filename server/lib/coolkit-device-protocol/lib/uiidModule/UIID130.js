"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID130_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID130_PROTOCOL = {
    uiid: 130,
    initParams(device) {
        const { faultState, sledOnline = 'on', current_00, voltage_00, actPow_00, reactPow_00, apparentPow_00, current_01, voltage_01, actPow_01, reactPow_01, apparentPow_01, current_02, voltage_02, actPow_02, reactPow_02, apparentPow_02, current_03, voltage_03, actPow_03, reactPow_03, apparentPow_03, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return {
            faultState,
            sledOnline,
            current_00,
            voltage_00,
            actPow_00,
            reactPow_00,
            apparentPow_00,
            current_01,
            voltage_01,
            actPow_01,
            reactPow_01,
            apparentPow_01,
            current_02,
            voltage_02,
            actPow_02,
            reactPow_02,
            apparentPow_02,
            current_03,
            voltage_03,
            actPow_03,
            reactPow_03,
            apparentPow_03,
            switches
        };
    },
    controlItem: {
        setSledOnline: protocol_1.commonSledOnline,
        toggle: protocol_1.commonMultiToggle,
        refreshPowerInfo(controlItem) {
            const { outlet = 0 } = controlItem;
            return {
                uiActive: { outlet: typeof outlet === 'number' ? outlet : 0, time: 60 }
            };
        },
        getHistoryPower(controlItem) {
            const { outlet = 0 } = controlItem;
            return {
                [`getKwh_0${outlet}`]: 2
            };
        },
        getOperateHistory(controlItem) {
            const { rangeStart = 0, rangeEnd = 29 } = controlItem;
            return { rangeStart, rangeEnd };
        }
    }
};
