"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID30002_PROTOCOL = void 0;
exports.UIID30002_PROTOCOL = {
    uiid: 30002,
    initParams: device => {
        const { subDevices = [] } = device.itemData.params;
        return { subDevices };
    },
    controlItem: {}
};
