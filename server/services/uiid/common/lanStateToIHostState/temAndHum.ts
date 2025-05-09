import { ILanStateTemAndHum } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

export default function lanStateToIHostStateByTemAndHum(lanState: ILanStateTemAndHum) {
    const iHostState = {};

    const temperature = _.get(lanState, 'temperature', null);

    if (temperature !== null) {
        _.merge(iHostState, {
            temperature: {
                temperature: Number(temperature) / 100,
            },
        });
    }
    const humidity = _.get(lanState, 'humidity', null);

    if (humidity !== null) {
        _.merge(iHostState, {
            humidity: {
                humidity: toIntNumber(Number(humidity) / 100),
            },
        });
    }

    const battery = _.get(lanState, 'battery', null);

    if (battery !== null) {
        _.merge(iHostState, {
            battery: {
                battery: toIntNumber(battery),
            },
        });
    }

    return iHostState;
}