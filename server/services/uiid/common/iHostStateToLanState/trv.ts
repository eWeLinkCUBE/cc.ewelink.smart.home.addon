import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import { TrvWorkMode } from "../../../../ts/interface/ILanState";
import { ILanStateTrv } from "../../../../ts/interface/ILanState";
import _ from "lodash";

export default function iHostStateToLanStateTRV(iHostState: IHostStateInterface) {
    const lanState = {};

    const targetSetpoint = _.get(iHostState, ['thermostat-target-setpoint', 'manual-mode', 'targetSetpoint'], null);
    if (targetSetpoint !== null) {
        _.merge(lanState, {
            manTargetTemp: targetSetpoint * 10,
        });
    }

    const workModeMap: Record<TrvWorkMode, ILanStateTrv['workMode']> = {
        [TrvWorkMode.MANUAL]: '0',
        [TrvWorkMode.ECO]: '1',
        [TrvWorkMode.AUTO]: '2',
    };
    const workMode: null | TrvWorkMode = _.get(iHostState, ['thermostat', 'thermostat-mode', 'thermostatMode'], null);
    if (workMode !== null && [TrvWorkMode.MANUAL, TrvWorkMode.ECO, TrvWorkMode.AUTO].includes(workMode)) {
        _.merge(lanState, {
            workMode: workModeMap[workMode],
        });
    }

    return lanState;
}