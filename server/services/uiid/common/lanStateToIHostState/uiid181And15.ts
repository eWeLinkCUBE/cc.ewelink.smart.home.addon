import {
    ILanState181and15,
} from '../../../../ts/interface/ILanState';
import { toIntNumber } from '../../../../utils/tool';
import _ from 'lodash';

export default function lanStateToIHostState181And15(lanState: ILanState181and15) {
    const iHostState: any = {};
    const currentHumidity = _.get(lanState, 'currentHumidity', null);
    if (currentHumidity !== null && currentHumidity !== 'unavailable') {
        _.assign(iHostState, {
            humidity: {
                humidity: toIntNumber(currentHumidity),
            },
        });
    }

    const currentTemperature = _.get(lanState, 'currentTemperature', null);
    if (currentTemperature !== null && currentTemperature !== 'unavailable') {
        _.assign(iHostState, {
            temperature: {
                temperature: toIntNumber(currentTemperature, 1),
            },
        });
    }

    return iHostState;
}