"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7027_PROTOCOL = void 0;
exports.UIID7027_PROTOCOL = {
    uiid: 7027,
    initParams: device => {
        const { switch: _switch = false, battery = 100, hasException = false, lastIrrigationTime = '', endIrrigationTime = '', todayWaterUsage = 0, todayWaterUsageGal = 0, autoAction, controlMode, exceptionReport, realIrrigationVolume, realIrrigationVolumeGal } = device.itemData.params;
        return {
            switch: _switch,
            battery,
            hasException,
            lastIrrigationTime,
            endIrrigationTime,
            todayWaterUsage,
            todayWaterUsageGal,
            autoAction,
            controlMode,
            exceptionReport,
            realIrrigationVolume,
            realIrrigationVolumeGal
        };
    },
    controlItem: {
        toggle: controlItem => {
            const { switch: start = 'on' } = controlItem;
            return { switch: start === 'on' ? true : false, controlMode: 'manual' };
        },
        controlWaterValve: controlItem => {
            const { switch: start = 'on', controlMode = 'manual', autoAction } = controlItem;
            if (autoAction) {
                return { switch: start === 'on' ? true : false, controlMode, autoAction };
            }
            return { switch: start === 'on' ? true : false, controlMode };
        },
        getWaterValveHistory: controlItem => {
            const { getHistory = 'last24Hours' } = controlItem;
            return { getHistory, NO_SAVE_DB: true };
        }
    }
};
