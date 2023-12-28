"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID5_PROTOCOL = void 0;
const protocol_1 = require("../protocol");
exports.UIID5_PROTOCOL = {
    uiid: 5,
    initParams: device => {
        const { power = '0', sledOnline = 'on', startup = 'off', switch: s = 'off' } = device.itemData.params;
        return { power, sledOnline, startup, switch: s };
    },
    controlItem: {
        toggle: protocol_1.commonSingleToggle,
        setSledOnline: protocol_1.commonSledOnline,
        setSingleStartup: protocol_1.commonSingleStartup,
        refreshPowerInfo() {
            return { uiActive: 60 };
        },
        getHistoryPower() {
            return { hundredDaysKwh: 'get' };
        },
        statisticsPower(controlItem) {
            const { oneKwh, startTime, endTime } = controlItem;
            if (oneKwh === 'start') {
                return {
                    oneKwh,
                    startTime,
                    endTime: ''
                };
            }
            else if (oneKwh === 'end') {
                return {
                    oneKwh,
                    startTime,
                    endTime
                };
            }
            return {
                oneKwh: 'get'
            };
        }
    }
};
