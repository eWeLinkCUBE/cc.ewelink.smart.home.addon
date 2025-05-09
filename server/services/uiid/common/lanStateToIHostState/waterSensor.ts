import { ILanStateWaterSensor } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

export default function lanStateToIHostStateByWaterSensor(lanState: ILanStateWaterSensor) {
    const iHostState = {};

    const water = _.get(lanState, 'water', null);
    if (water !== null) {
        _.merge(iHostState, {
            'water-leak': {
                waterLeak: water === 1,
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
