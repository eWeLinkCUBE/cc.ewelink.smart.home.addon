import { ILanStateMultipleSwitch } from "../../../../ts/interface/ILanState";
import _ from "lodash";

// 单通道用多通道协议 (Single channel uses multi-channel protocol)
export default function getSingleMultiProtocolIHostState(lanState: ILanStateMultipleSwitch) {
    let iHostState: any = {};
    const switches = _.get(lanState, 'switches');
    if (switches) {
        iHostState = {
            power: {
                powerState: switches[0].switch,
            },
        };
    }

    return iHostState;
}