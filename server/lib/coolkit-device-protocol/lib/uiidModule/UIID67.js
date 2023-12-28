"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID67_PROTOCOL = void 0;
exports.UIID67_PROTOCOL = {
    uiid: 67,
    initParams: device => {
        const { op, per, set, statu } = device.itemData.params;
        return { op, per, set, statu };
    },
    controlItem: {
        setStopMode(controlItem) {
            const { stopMode = 0 } = controlItem;
            return { set: stopMode };
        },
        controlCurtain(controlItem) {
            const { switch: curtainSwitch, setclose } = controlItem;
            if (typeof setclose === 'number') {
                return { per: setclose };
            }
            else {
                const op = curtainSwitch === 'on' ? 1 : curtainSwitch === 'off' ? 3 : 2;
                return { op };
            }
        }
    }
};
