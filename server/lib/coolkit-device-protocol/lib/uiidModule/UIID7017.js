"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIID7017_PROTOCOL = void 0;
exports.UIID7017_PROTOCOL = {
    uiid: 7017,
    initParams: device => {
        const { battery = 100, trigTime, subOtaInfo, temperature, childLock, curTargetTemp = 190, ecoTargetTemp = 50, autoTargetTemp, workMode, workState, fault, windowSwitch, tempCorrection = 0, sun = '000000a001a400be052800a0052800a0052800a0052800a0', mon = '000000a0016800be021c00a003c000be052800a0052800a0', tues = '000000a0016800be021c00a003c000be052800a0052800a0', wed = '000000a0016800be021c00a003c000be052800a0052800a0', thur = '000000a0016800be021c00a003c000be052800a0052800a0', fri = '000000a0016800be021c00a003c000be052800a0052800a0', sat = '000000a001a400be052800a0052800a0052800a0052800a0' } = device.itemData.params;
        return {
            battery,
            trigTime,
            subOtaInfo,
            temperature,
            childLock,
            curTargetTemp,
            ecoTargetTemp,
            autoTargetTemp,
            workMode,
            workState,
            fault,
            windowSwitch,
            tempCorrection,
            sun,
            mon,
            tues,
            wed,
            thur,
            fri,
            sat
        };
    },
    controlItem: {
        setChildLock: controlItem => {
            const { childLock = 'off' } = controlItem;
            return {
                childLock: childLock === 'on' ? true : false
            };
        },
        setWindowSwitch: controlItem => {
            const { windowSwitch = false } = controlItem;
            return {
                windowSwitch
            };
        },
        setTargetTemp: controlItem => {
            const { targetTemp = 40 } = controlItem;
            return {
                manTargetTemp: targetTemp
            };
        },
        setTempCorrection: controlItem => {
            const { tempCorrection = 0 } = controlItem;
            return {
                tempCorrection
            };
        },
        setWorkMode: controlItem => {
            const { workMode = '0' } = controlItem;
            return {
                workMode: `${workMode}`
            };
        },
        setEcoTargetTemperature: controlItem => {
            const { targetTemp = 40 } = controlItem;
            return {
                ecoTargetTemp: targetTemp
            };
        },
        setSchedule: controlItem => {
            const { scheduleParams = {} } = controlItem;
            let params = {
                mon: '',
                tues: '',
                wed: '',
                thur: '',
                fri: '',
                sat: '',
                sun: ''
            };
            Object.keys(scheduleParams).forEach(key => {
                const schedule = key;
                if (scheduleParams[schedule]) {
                    params[`${schedule}`] = scheduleParams[schedule];
                }
            });
            return params;
        }
    }
};
