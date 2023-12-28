"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonMultiInching = exports.commonSingleInching = void 0;
const constant_1 = require("../constant");
function commonSingleInching(controlItem) {
    const { pulse = 'on', width = 500 } = controlItem;
    return {
        pulse,
        pulseWidth: width
    };
}
exports.commonSingleInching = commonSingleInching;
function commonMultiInching(controlItem, width) {
    const { pulses = [], device: { params: { pulses: _pulses = (0, constant_1.getDefaultInching)().pulses } } } = controlItem;
    pulses.push(..._pulses.slice(pulses.length));
    return {
        pulses: pulses.map(item => {
            if (width && typeof width === 'number' && !item.width) {
                item.width = width;
            }
            return item;
        })
    };
}
exports.commonMultiInching = commonMultiInching;
