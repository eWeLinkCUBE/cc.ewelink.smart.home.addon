import { ILanStateWaterSensor } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import ECapability from "../../../../ts/enum/ECapability";
import IHostDeviceData from "../../../../ts/interface/IHostDeviceData";
import { getSensorState } from "./sensor";
import _ from "lodash";

export default function lanStateToIHostStateByWaterSensor(lanState: ILanStateWaterSensor, iHostDeviceData: IHostDeviceData | null) {
    const iHostState = {};

    const water = _.get(lanState, 'water', null);
    if (water !== null) {
        _.merge(iHostState, getSensorState(iHostDeviceData, water === 1, [ECapability.WATER_LEAK, 'waterLeak']));
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
