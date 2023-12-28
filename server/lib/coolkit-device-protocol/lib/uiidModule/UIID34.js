"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID34_PROTOCOL = void 0;
const constant_1 = require("../constant");
exports.UIID34_PROTOCOL = {
    uiid: 34,
    initParams(device) {
        const { configure = (0, constant_1.getDefaultStartup)(4, 'off').configure, switches = (0, constant_1.getDefaultSwitches)(4, 'off').switches } = device.itemData.params;
        return { configure, switches };
    },
    controlItem: {
        toggle(controlItem) {
            const { device: { params: { switches } } } = controlItem;
            const lightSwitch = switches[0].switch === 'on' ? 'off' : 'on';
            return { switches: [{ switch: lightSwitch, outlet: 0 }, switches[1], switches[2], switches[3]] };
        },
        toggleFan(controlItem) {
            const { device: { params: { switches } } } = controlItem;
            const fanSwitch = switches[1].switch === 'on' ? 'off' : 'on';
            return { switches: [switches[0], { switch: fanSwitch, outlet: 1 }, switches[2], switches[3]] };
        },
        setFanLightMode(controlItem) {
            const { device: { params }, fanMode } = controlItem;
            const switches = [Object.assign({}, params.switches[0]), { switch: 'on', outlet: 1 }];
            switch (fanMode) {
                case 'low':
                    switches.push({ switch: 'off', outlet: 2 }, { switch: 'off', outlet: 3 });
                    break;
                case 'mid':
                    switches.push({ switch: 'on', outlet: 2 }, { switch: 'off', outlet: 3 });
                    break;
                case 'high':
                    switches.push({ switch: 'off', outlet: 2 }, { switch: 'on', outlet: 3 });
                    break;
            }
            return { switches };
        },
        setMultiStartup(controlItem) {
            const { configure = [] } = controlItem;
            return {
                configure
            };
        }
    }
};
