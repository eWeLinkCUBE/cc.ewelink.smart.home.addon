"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7004_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID7004_PROTOCOL = {
    uiid: 7004,
    initParams: device => {
        const { startup = 'off', switch: s = 'off', subOtaInfo } = device.itemData.params;
        return { startup, switch: s, subOtaInfo };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSingleStartup: protocol_1.commonSingleStartup
    }
};
