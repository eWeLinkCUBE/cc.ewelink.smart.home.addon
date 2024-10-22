"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID224_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID224_PROTOCOL = {
    uiid: 224,
    initParams: device => {
        const { sledOnline = 'on', partnerDevice } = device.itemData.params;
        return { sledOnline, partnerDevice };
    },
    controlItem: {
        setSledOnline: protocol_1.commonSledOnline,
        control433Button: controlItem => {
            const { key = 0 } = controlItem;
            return {
                key
            };
        }
    }
};
