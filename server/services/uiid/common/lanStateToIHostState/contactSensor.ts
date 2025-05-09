import { ILanStateContactSensor } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

export default function lanStateToIHostStateByContactSensor(lanState: ILanStateContactSensor) {
    // 门窗传感器：0关闭，1开门 (Door and window sensor: 0 to close, 1 to open the door)
    // iHost 门窗传感器 detected，false关闭，1打开 (iHost door and window sensor detected, false to turn off, 1 to turn on)
    const DOOR_SENSOR_LOCK_MAP = {
        0: false,
        1: true,
    };
    const iHostState = {};

    const lockStatus = _.get(lanState, 'lock', null);

    if (lockStatus !== null) {
        _.merge(iHostState, {
            contact: {
                contact: DOOR_SENSOR_LOCK_MAP[lockStatus],
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