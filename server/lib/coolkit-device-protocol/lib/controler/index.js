"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlDevice = void 0;
const uiidModule_1 = require("../uiidModule");
function controlDevice(device, type, params) {
    const deviceSupportFunction = (0, uiidModule_1.getUiidCapability)(device);
    if (deviceSupportFunction) {
        const functionItem = deviceSupportFunction[type];
        if (!functionItem)
            return undefined;
        return functionItem(Object.assign({ device }, params));
    }
    return undefined;
}
exports.controlDevice = controlDevice;
