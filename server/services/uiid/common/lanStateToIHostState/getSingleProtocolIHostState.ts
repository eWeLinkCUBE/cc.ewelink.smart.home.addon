import _ from "lodash";
import { ILanStateSingleSwitch } from "../../../../ts/interface/ILanState";

/** 单通道协议 */
export default function getSingleProtocolIHostState(lanState: ILanStateSingleSwitch, getPowerState: (powerState: string) => string | boolean = powerState => powerState) {
    let iHostState: any = {};
    const powerState = _.get(lanState, 'switch', null);
    if (powerState !== null) {
        iHostState = {
            power: {
                powerState: getPowerState(powerState),
            },
        };
    }
    return iHostState;
}