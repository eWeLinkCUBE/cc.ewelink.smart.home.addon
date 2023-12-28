"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID98_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID98_PROTOCOL = {
    uiid: 98,
    initParams(device) {
        return device.itemData.params;
    },
    controlItem: {
        setSledOnline: protocol_1.commonSledOnline
    }
};
