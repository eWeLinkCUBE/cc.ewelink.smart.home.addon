"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonMultiToggle = exports.commonSingleToggle = void 0;
const constant_1 = require("../constant");
function commonSingleToggle(controlItem) {
    const { device: { params }, switch: state } = controlItem;
    if (state) {
        return { switch: state };
    }
    return params.switch === 'on' ? { switch: 'off' } : { switch: 'on' };
}
exports.commonSingleToggle = commonSingleToggle;
function commonMultiToggle(controlItem, len = 4) {
    var _a;
    const { device: { params }, outlet, switch: state = 'off' } = controlItem;
    if (outlet === 'all') {
        return (0, constant_1.getDefaultSwitches)(len, state);
    }
    const switches = params.switches;
    const lock = (_a = params.lock) !== null && _a !== void 0 ? _a : 0;
    return {
        switches: !lock
            ? switches.map(item => {
                if (item.outlet === outlet) {
                    item.switch = state;
                }
                return item;
            })
            : (0, constant_1.getDefaultSwitches)(len, 'off').switches.map(item => {
                if (item.outlet === outlet) {
                    item.switch = state;
                }
                return item;
            })
    };
}
exports.commonMultiToggle = commonMultiToggle;
