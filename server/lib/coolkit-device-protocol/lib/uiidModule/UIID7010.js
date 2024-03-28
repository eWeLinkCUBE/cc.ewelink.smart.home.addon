"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7010_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID7010_PROTOCOL = {
    uiid: 7010,
    initParams: device => {
        const { pulses, backlight = 'on', startup = 'off', switch: s = 'off', subOtaInfo, wallPenetration } = device.itemData.params;
        return { pulses, backlight, startup, switch: s, subOtaInfo, wallPenetration };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSingleStartup: protocol_1.commonSingleStartup,
        setSingleInchingMode: protocol_1.commonSingleInching,
        setBackLight: protocol_1.commonBackLight,
        setTurbo: controlItem => {
            const { turbo = false } = controlItem;
            return {
                wallPenetration: turbo
            };
        }
    }
};
