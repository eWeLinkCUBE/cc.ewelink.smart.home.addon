import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import { ILanStateSwitch } from "../../../../ts/interface/ILanState";
import _ from "lodash";

/**公共逻辑：转化多通道设备的能力状态 */
export default function getMultiProtocolLanState(iHostState: IHostStateInterface) {
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
    } else {
        const toggleObj = _.get(iHostState, 'toggle');
        if (toggleObj) {
            const switches: any = [];
            for (const toggleIndex in toggleObj) {
                switches.push({
                    switch: toggleObj[toggleIndex].toggleState,
                    outlet: Number(toggleIndex) - 1,
                });
            }
            lanState = { switches }
        }
    }

    return lanState;
}