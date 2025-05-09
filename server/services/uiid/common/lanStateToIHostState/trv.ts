import IEWeLinkDevice from "../../../../ts/interface/IEWeLinkDevice";
import { ILanStateTrv, TrvWorkMode, TrvWorkState } from "../../../../ts/interface/ILanState";
import logger from "../../../../log";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

function isTargetInRange(min: number, max: number, target: number, shouldDivideByTen = true) {
    const targetValue = shouldDivideByTen ? target / 10 : target;
    return min <= targetValue && targetValue <= max;
}

export default function lanStateToIHostStateByTRV(lanState: ILanStateTrv, eWeLinkDeviceData: IEWeLinkDevice) {
    logger.info('lanState TRV -------', lanState);
    const iHostState = {};
    const workModeMap: Record<ILanStateTrv['workMode'], TrvWorkMode> = {
        '0': TrvWorkMode.MANUAL,
        '1': TrvWorkMode.ECO,
        '2': TrvWorkMode.AUTO,
    };
    const workStateMap: Record<ILanStateTrv['workState'], TrvWorkState> = {
        '0': TrvWorkState.INACTIVE,
        '1': TrvWorkState.HEATING,
    };

    const workMode = _.get(lanState, 'workMode', null);
    if (workMode !== null && ['0', '1', '2'].includes(workMode)) {
        _.merge(iHostState, {
            thermostat: {
                'thermostat-mode': {
                    thermostatMode: workModeMap[workMode],
                },
            },
        });
    }

    const workState = _.get(lanState, 'workState', null);
    if (workState !== null && ['0', '1'].includes(workState)) {
        _.merge(iHostState, {
            thermostat: {
                'adaptive-recovery-status': {
                    adaptiveRecoveryStatus: workStateMap[workState],
                },
            },
        });
    }

    const curTargetTemp = _.get(lanState, 'curTargetTemp', null);
    const realWorkMode = workMode ?? _.get(eWeLinkDeviceData, 'itemData.params.workMode', null);
    if (curTargetTemp !== null && isTargetInRange(4, 35, curTargetTemp) && realWorkMode !== null) {
        const modes = ['manual-mode', 'eco-mode', 'auto-mode'];
        const targetSetpointValue = curTargetTemp / 10;
        modes.forEach((mode) => {
            _.merge(iHostState, { 'thermostat-target-setpoint': { [mode]: { targetSetpoint: targetSetpointValue } } });
        });
    }

    const manTargetTemp = _.get(lanState, 'manTargetTemp', null);
    if (manTargetTemp !== null && isTargetInRange(4, 35, manTargetTemp)) {
        _.merge(iHostState, { 'thermostat-target-setpoint': { 'manual-mode': { targetSetpoint: manTargetTemp / 10 } } });
    }

    const ecoTargetTemp = _.get(lanState, 'ecoTargetTemp', null);
    if (ecoTargetTemp !== null && isTargetInRange(4, 35, ecoTargetTemp)) {
        _.merge(iHostState, { 'thermostat-target-setpoint': { 'eco-mode': { targetSetpoint: ecoTargetTemp / 10 } } });
    }

    const autoTargetTemp = _.get(lanState, 'autoTargetTemp', null);
    if (autoTargetTemp !== null && isTargetInRange(4, 35, autoTargetTemp)) {
        _.merge(iHostState, { 'thermostat-target-setpoint': { 'auto-mode': { targetSetpoint: autoTargetTemp / 10 } } });
    }

    const temperature = _.get(lanState, 'temperature', null);
    if (temperature !== null) {
        _.merge(iHostState, {
            temperature: { temperature: temperature / 10 },
        });
    }

    const battery = _.get(lanState, 'battery', null);
    if (battery !== null && isTargetInRange(1, 100, battery, false)) {
        _.merge(iHostState, {
            battery: {
                battery: toIntNumber(battery),
            },
        });
    }

    return iHostState;
}