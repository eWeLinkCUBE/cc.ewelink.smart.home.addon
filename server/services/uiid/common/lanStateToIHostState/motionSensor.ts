import { ILanStateMotionSensor } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

export default function lanStateToIHostStateByMotionSensor(lanState: ILanStateMotionSensor) {
    const MOTION_MAP = {
        0: false,
        1: true,
    };

    const iHostState = {};

    const motion = _.get(lanState, 'motion', null);

    if (motion !== null) {
        _.merge(iHostState, {
            motion: {
                motion: MOTION_MAP[motion],
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