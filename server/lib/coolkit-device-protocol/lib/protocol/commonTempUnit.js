"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonTempUnit = void 0;
function commonTempUnit(controlItem) {
    const { device: { uiid, params: { tempUnit = 0, tempScale = 'c' } } } = controlItem;
    if (uiid === 127) {
        return { tempScale: tempScale === 'c' ? 'f' : 'c' };
    }
    else {
        return { tempUnit: tempUnit === 0 ? 1 : 0 };
    }
}
exports.commonTempUnit = commonTempUnit;
