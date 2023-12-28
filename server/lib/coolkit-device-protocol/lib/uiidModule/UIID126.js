"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID126_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID126_PROTOCOL = {
    uiid: 126,
    initParams(device) {
        const { calibState = 0, workMode, swMode_00 = 2, swMode_01 = 2, swReverse_00 = 0, swReverse_01 = 0, motorTurn, location = 0, currLocation = 0, motorSwMode = 2, stopMode, outputReverse = 0, motorSwReverse = 0, impedeCurrent, motionCurrent, sledBright = 100, current_00, voltage_00, actPow_00, reactPow_00, apparentPow_00, current_01, voltage_01, actPow_01, reactPow_01, apparentPow_01, configure = (0, constant_1.getDefaultStartup)(2, 'off').configure, pulses = (0, constant_1.getDefaultInching)(2, 'off', 1000).pulses, switches = (0, constant_1.getDefaultSwitches)(2, 'off').switches } = device.itemData.params;
        return {
            calibState,
            workMode,
            swMode_00,
            swMode_01,
            swReverse_00,
            swReverse_01,
            motorTurn,
            location,
            currLocation,
            motorSwMode,
            stopMode,
            outputReverse,
            motorSwReverse,
            impedeCurrent,
            motionCurrent,
            sledBright,
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
            configure,
            pulses,
            switches
        };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setMultiStartup: protocol_1.commonMultiStartup,
        setMultiInchingMode: protocol_1.commonMultiInching,
        getHistoryPower(controlItem) {
            const { outlet = 0 } = controlItem;
            return {
                [`getKwh_0${outlet}`]: 2
            };
        },
        refreshPowerInfo(controlItem) {
            const { outlet = 0 } = controlItem;
            if (outlet === 'all') {
                return {
                    uiActive: {
                        all: 1,
                        time: 60
                    }
                };
            }
            return {
                uiActive: { outlet, time: 60 }
            };
        },
        setStopMode(controlItem) {
            const { stopMode = 1 } = controlItem;
            return { stopMode };
        },
        controlCurtain(controlItem) {
            const { switch: curtainSwitch, setclose } = controlItem;
            if (typeof setclose === 'number') {
                return { location: setclose };
            }
            else {
                const motorTurn = curtainSwitch === 'on' ? 1 : curtainSwitch === 'off' ? 2 : 0;
                return { motorTurn };
            }
        },
        setSledOnline(controlItem) {
            const { device: { params: { sledBright } } } = controlItem;
            return {
                sledBright: sledBright ? 0 : 100
            };
        }
    }
};
