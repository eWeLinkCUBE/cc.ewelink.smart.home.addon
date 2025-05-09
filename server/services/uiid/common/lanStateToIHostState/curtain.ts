import { ILanStateCurtain } from "../../../../ts/interface/ILanState";
import _ from "lodash";

/** 窗帘相关 zigbee 设备生成 iHostState 的通用方法 */
export default function lanStateToIHostStateByCurtain(lanState: ILanStateCurtain) {
    const iHostState = {};
    const curPercent = _.get(lanState, 'curPercent', null);

    if (curPercent !== null) {
        _.merge(iHostState, {
            percentage: {
                percentage: curPercent,
            },
        });
    }

    return iHostState;
}