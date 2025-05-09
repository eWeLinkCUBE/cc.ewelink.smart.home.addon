import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import { ILanStateSwitch } from "../../../../ts/interface/ILanState";
import _ from "lodash";

// 单通道用多通道协议 (Single channel uses multi-channel protocol)
export default function getSingleMultiProtocolLanState(iHostState: IHostStateInterface) {
    let lanState = {};
    const power = _.get(iHostState, 'power', null);
    if (power) {
        const switches: ILanStateSwitch[] = [];

        Array(4)
            .fill(null)
            .forEach((item, index) => {
                switches.push({
                    switch: power.powerState,
                    outlet: index,
                });
            });

        lanState = { switches };
    }

    return lanState;
}