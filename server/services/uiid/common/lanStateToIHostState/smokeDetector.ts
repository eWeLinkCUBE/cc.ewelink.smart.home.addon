import { ILanStateSmokeDetector } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import { getSensorState } from "./sensor";
import ECapability from "../../../../ts/enum/ECapability";
import IHostDeviceData from "../../../../ts/interface/IHostDeviceData";
import _ from "lodash";

export default function lanStateToIHostStateBySmokeDetector(lanState: ILanStateSmokeDetector, iHostDeviceData: IHostDeviceData | null) {
    const iHostState = {};

    const smoke = _.get(lanState, 'smoke', null);
    if (smoke !== null) {
        _.merge(iHostState, getSensorState(iHostDeviceData, smoke === 1, [ECapability.SMOKE, ECapability.SMOKE]));
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