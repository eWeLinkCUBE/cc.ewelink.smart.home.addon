import {
    ILanStateLight, ILanStateSwitch,
} from '../../../../ts/interface/ILanState';
import _ from 'lodash';
import getSingleProtocolIHostState from './getSingleProtocolIHostState';

export default function lanStateToIHostStateLight(lanState: ILanStateLight | ILanStateSwitch, ctValue: number | null) {
    const iHostState = {};
    const ltype = _.get(lanState, 'ltype', null); // 情景模式 (Scenario)

    if (ltype !== null) {
        const brValue = _.get(lanState, [ltype, 'br'], null); // 亮度
        const redValue = _.get(lanState, [ltype, 'r'], null); // 红色
        const greenValue = _.get(lanState, [ltype, 'g'], null); // 绿色
        const blueValue = _.get(lanState, [ltype, 'b'], null); // 蓝色

        if (brValue !== null) {
            _.assign(iHostState, {
                brightness: {
                    brightness: brValue,
                },
            });
        }

        if (ctValue !== null) {
            _.assign(iHostState, {
                'color-temperature': {
                    colorTemperature: ctValue,
                },
            });
        }

        if (redValue !== null && greenValue !== null && blueValue !== null) {
            _.assign(iHostState, {
                'color-rgb': {
                    red: redValue,
                    green: greenValue,
                    blue: blueValue,
                },
            });
        }
    }
    _.assign(iHostState, getSingleProtocolIHostState(lanState as ILanStateSwitch));

    return iHostState;
}