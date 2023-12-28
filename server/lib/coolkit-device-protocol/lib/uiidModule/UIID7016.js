"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7016_PROTOCOL = void 0;
exports.UIID7016_PROTOCOL = {
    uiid: 7016,
    initParams: device => {
        const { human = 0, judgeTime = 60, sensitivity = 1, trigTime } = device.itemData.params;
        return { human, judgeTime, sensitivity, trigTime };
    },
    controlItem: {
        setSensitivity(controlItem) {
            const { sensitivity = 1 } = controlItem;
            return {
                sensitivity
            };
        },
        setDetectedDuration(controlItem) {
            const { duration = 1 } = controlItem;
            return {
                judgeTime: duration
            };
        }
    }
};
