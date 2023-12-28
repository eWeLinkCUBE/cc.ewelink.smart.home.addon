"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID11_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID11_PROTOCOL = {
    uiid: 11,
    initParams: device => {
        const { calibState = 0, pulse = 'off', pulseWidth = 500, sledOnline = 'on', startup = 'off', switch: s = 'off', setclose = 50 } = device.itemData.params;
        return { calibState, pulse, pulseWidth, sledOnline, startup, switch: s, setclose };
    },
    controlItem: {
        setSledOnline: protocol_1.commonSledOnline,
        controlCurtain(controlItem) {
            const { switch: curtainSwitch, setclose } = controlItem;
            if (typeof setclose === 'number') {
                return {
                    setclose
                };
            }
            else {
                return {
                    switch: curtainSwitch
                };
            }
        }
    }
};
