"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID57_PROTOCOL = void 0;
exports.UIID57_PROTOCOL = {
    uiid: 57,
    initParams(device) {
        const { channel0 = '255', state = 'off' } = device.itemData.params;
        return { channel0, state };
    },
    controlItem: {
        toggle(controlItem) {
            const { params } = controlItem.device;
            return params.state === 'on' ? { state: 'off' } : { state: 'on' };
        },
        setBrightness(controlItem) {
            const { brightness = 1 } = controlItem;
            let bright = parseInt((brightness / 100) * 231 + '') + 25;
            bright > 255 && (bright = 255);
            return {
                channel0: `${bright}`
            };
        }
    }
};
