import { ILanStateMultipleSwitch } from "../../../../ts/interface/ILanState";
import _ from "lodash";

/**公共逻辑：通过设备通道数量初始化多通道协议的 iHostState 中的 toggle 能力状态 */
export default function getMultiProtocolIHostState(lanState: ILanStateMultipleSwitch, toggleLength: number) {
    let iHostState: any = null;
    const toggle: any = {};

    const switches = _.get(lanState, 'switches');

    switches &&
        switches.forEach((item: { outlet: number; switch: any }, index: number) => {
            // 去除掉多余的通道 (Remove unnecessary channels)
            if (index < toggleLength) {
                toggle[item.outlet + 1] = {
                    toggleState: item.switch,
                };
            }
        });

    iHostState = {
        toggle,
    };

    return iHostState;
}