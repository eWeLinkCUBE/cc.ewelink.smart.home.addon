"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID30003_PROTOCOL = void 0;
exports.UIID30003_PROTOCOL = {
    uiid: 30003,
    initParams(device) {
        const { switches = [] } = device.itemData.params;
        return { switches };
    },
    controlItem: {
        toggle: controlItem => {
            const { outlet = 0, switch: state = 'off' } = controlItem;
            return {
                switches: [{ outlet: outlet, switch: state }]
            };
        }
    }
};
