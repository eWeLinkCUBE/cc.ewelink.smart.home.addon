import { ILanStateMultiPress } from "../../../../ts/interface/ILanState";
import _ from "lodash";

export default function lanStateToIHostStateByMultiPress(lanState: ILanStateMultiPress) {
    const iHostState = {};

    // 无线按键：0单击，1双击，2长按
    // Wireless buttons: 0 click, 1 double click, 2 long press
    const BUTTON_PRESS_MAP = {
        0: 'singlePress',
        1: 'doublePress',
        2: 'longPress',
    };
    const outlet = _.get(lanState, 'outlet', null);

    const pressKey = _.get(lanState, 'key', null);

    if (pressKey !== null && outlet !== null) {
        _.merge(iHostState, {
            'multi-press': {
                [outlet + 1]: {
                    press: BUTTON_PRESS_MAP[pressKey],
                },
            },
        });
    }

    return iHostState;
}