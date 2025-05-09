import { ILanStateButton } from "../../../../ts/interface/ILanState";
import { toIntNumber } from "../../../../utils/tool";
import _ from "lodash";

/** zigbee 设备 1000, 7000, 1001 无线按键生成 iHost 能力状态  */
export default function lanStateToIHostStateBy1000And7000And1001(lanState: ILanStateButton) {
    const iHostState: any = {};
    // 无线按键：0单击，1双击，2长按
    // Wireless buttons: 0 click, 1 double click, 2 long press
    const BUTTON_PRESS_MAP = {
        0: 'singlePress',
        1: 'doublePress',
        2: 'longPress',
    };

    const pressKey = _.get(lanState, 'key', null);

    if (pressKey !== null) {
        _.merge(iHostState, {
            press: {
                press: BUTTON_PRESS_MAP[pressKey],
            },
        });
    }

    const battery = _.get(lanState, 'battery', null);

    if (battery !== null) {
        _.merge(iHostState, {
            battery: {
                battery: toIntNumber(battery)
            },
        });
    }

    return iHostState;
}