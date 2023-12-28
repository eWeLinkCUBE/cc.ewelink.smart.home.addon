"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultStartup = exports.getDefaultInching = exports.getDefaultSwitches = exports.deviceType = exports.groupType = void 0;
exports.groupType = [3, 4, 7];
exports.deviceType = [1, 2, 5, 6];
function getDefaultSwitches(length = 4, action = 'off') {
    return {
        switches: Array.from({ length }, (v, k) => ({ switch: action, outlet: k }))
    };
}
exports.getDefaultSwitches = getDefaultSwitches;
function getDefaultInching(length = 4, action = 'off', width = 500) {
    return {
        pulses: Array.from({ length }, (v, k) => ({ pulse: action, width, outlet: k }))
    };
}
exports.getDefaultInching = getDefaultInching;
function getDefaultStartup(length = 4, action = 'off') {
    return {
        configure: Array.from({ length }, (v, k) => ({ startup: action, outlet: k }))
    };
}
exports.getDefaultStartup = getDefaultStartup;
