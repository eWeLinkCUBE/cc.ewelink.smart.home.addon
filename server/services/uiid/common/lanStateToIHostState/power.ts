import {
    ILanStateElectricDevice,
} from '../../../../ts/interface/ILanState';
import { toIntNumber } from '../../../../utils/tool';
import _ from 'lodash';

export default function lanStateToIHostStatePowerDevice(lanState: ILanStateElectricDevice, unitValue: number) {
    const iHostState = {};

    const power = _.get(lanState, 'power', null); // 功率 (power)
    if (power !== null) {
        _.assign(iHostState, {
            'electric-power': {
                'electric-power': toIntNumber(power * unitValue),
            },
        });
    }

    const voltage = _.get(lanState, 'voltage', null); // 电压 (Voltage)
    if (voltage !== null) {
        _.assign(iHostState, {
            voltage: {
                voltage: toIntNumber(voltage * unitValue),
            },
        });
    }

    const current = _.get(lanState, 'current', null); // 电量
    if (current !== null) {
        _.assign(iHostState, {
            'electric-current': {
                'electric-current': toIntNumber(current * unitValue),
            },
        });
    }

    return iHostState;
}