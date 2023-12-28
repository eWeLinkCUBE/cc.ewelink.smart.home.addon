"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID28_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID28_PROTOCOL = {
    uiid: 28,
    initParams(device) {
        return device.itemData.params;
    },
    controlItem: {
        setSledOnline: protocol_1.commonSledOnline,
        controlRfGatewayDevice(controlItem) {
            const { rfChl = 0 } = controlItem;
            return {
                cmd: 'transmit',
                rfChl
            };
        }
    }
};
