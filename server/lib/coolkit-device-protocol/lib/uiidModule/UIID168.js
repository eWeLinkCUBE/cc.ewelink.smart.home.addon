"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID168_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID168_PROTOCOL = {
    uiid: 168,
    initParams: device => {
        const { sledOnline = 'on', zled = 'on' } = device.itemData.params;
        return { sledOnline, zled };
    },
    controlItem: {
        setSledOnline: protocol_1.commonSledOnline,
        setZled(controlItem) {
            const { device: { params: { zled } } } = controlItem;
            return { zled: zled === 'off' ? 'on' : 'off' };
        }
    }
};
