import { ILanStateMotionSensor } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";
import { getSensorState } from "./sensor";
import IHostDeviceData from "../../../../ts/interface/IHostDeviceData";
import ECapability from "../../../../ts/enum/ECapability";

export default function lanStateToIHostStateByMotionSensor(lanState: ILanStateMotionSensor, iHostDeviceData: IHostDeviceData | null) {
    const MOTION_MAP = {
        0: false,
        1: true,
    };

    const iHostState = {};

    const motion = _.get(lanState, 'motion', null);

    if (motion !== null) {
        _.merge(iHostState, getSensorState(iHostDeviceData, MOTION_MAP[motion], [ECapability.MOTION, ECapability.MOTION]));
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