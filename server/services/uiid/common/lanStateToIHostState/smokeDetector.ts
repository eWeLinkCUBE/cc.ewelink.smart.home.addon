import { ILanStateSmokeDetector } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

export default function lanStateToIHostStateBySmokeDetector(lanState: ILanStateSmokeDetector) {
    const iHostState = {};

    const smoke = _.get(lanState, 'smoke', null);
    if (smoke !== null) {
        _.merge(iHostState, {
            smoke: {
                smoke: smoke === 1,
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