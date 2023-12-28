"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonBackLight = void 0;
function commonBackLight(controlItem) {
    const { device: { params } } = controlItem;
    return {
        backlight: params.backlight ? 'off' : 'on'
    };
}
exports.commonBackLight = commonBackLight;
