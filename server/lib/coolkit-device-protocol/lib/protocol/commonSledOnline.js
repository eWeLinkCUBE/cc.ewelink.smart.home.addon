"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSledOnline = void 0;
function commonSledOnline(controlItem) {
    const { device: { params } } = controlItem;
    return {
        sledOnline: params.sledOnline === 'off' ? 'on' : 'off'
    };
}
exports.commonSledOnline = commonSledOnline;
