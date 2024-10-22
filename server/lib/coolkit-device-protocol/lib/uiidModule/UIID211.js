"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID211_PROTOCOL = void 0;
const constant_1 = require("../constant");
const protocol_1 = require("../protocol");
exports.UIID211_PROTOCOL = {
    uiid: 211,
    initParams: device => {
        const { configure = (0, constant_1.getDefaultStartup)(4, 'off').configure.map(item => {
            return Object.assign(Object.assign({}, item), { enableDelay: 0, width: 500 });
        }), pulses = (0, constant_1.getDefaultInching)(4, 'off').pulses.map(item => {
            return Object.assign(Object.assign({}, item), { switch: 'off' });
        }), switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches, lightSwitch = 'off', lightMode = 0, sledOnline = 'off', workMode = 1, calibState = false, motorReversal = false, electromotor = 1, percentageControl = 50, disableSwipeGesture = true } = device.itemData.params;
        return { configure, pulses, switches, lightSwitch, lightMode, sledOnline, workMode, calibState, motorReversal, electromotor, percentageControl, disableSwipeGesture };
    },
    controlItem: {
        toggle: protocol_1.commonMultiToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setLightSwitch: controlItem => {
            const { lightSwitch = 'off' } = controlItem;
            return {
                lightSwitch
            };
        },
        setWorkMode: controlItem => {
            const { workMode = 1 } = controlItem;
            return {
                workMode
            };
        },
        setLightMode: controlItem => {
            const { colorMode = 0 } = controlItem;
            return {
                lightMode: colorMode
            };
        },
        controlCurtain: controlItem => {
            const { switch: curtainSwitch, setclose } = controlItem;
            if (typeof setclose === 'number') {
                return { percentageControl: setclose };
            }
            else {
                const electromotor = curtainSwitch === 'on' ? 0 : curtainSwitch === 'off' ? 2 : 1;
                return { electromotor };
            }
        },
        setMultiInchingMode(controlItem) {
            return (0, protocol_1.commonMultiInching)(controlItem, 1000, 'off');
        },
        setMultiStartup: protocol_1.commonMultiStartup,
        setMotorReverse: controlItem => {
            const { motorReverse = false } = controlItem;
            return {
                motorReversal: motorReverse
            };
        }
    }
};
