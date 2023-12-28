"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonLock = void 0;
function commonLock(controlItem) {
    const { lock } = controlItem;
    return {
        lock: lock ? 1 : 0
    };
}
exports.commonLock = commonLock;
