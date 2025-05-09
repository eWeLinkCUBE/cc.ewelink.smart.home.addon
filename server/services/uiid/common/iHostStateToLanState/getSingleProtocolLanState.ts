import _ from "lodash";
import { IHostStateInterface } from "../../../../ts/interface/IHostState";

/** 单通道协议 iHostState 转化成 lanState 的方法 */
export default function getSingleProtocolLanState(iHostState: IHostStateInterface, getSwitchState: (powerState: string) => string | boolean = powerState => powerState) {
    let lanState = {};
    const power = _.get(iHostState, 'power', null);
    if (power) {
        const { powerState } = power;
        lanState = { switch: getSwitchState(powerState) };
    }

    return lanState;
}