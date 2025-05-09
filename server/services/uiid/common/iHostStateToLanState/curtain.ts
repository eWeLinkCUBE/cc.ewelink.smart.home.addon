import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import _ from "lodash";

/** 窗帘相关 zigbee 设备控制生成 lanState 的通用方法 */
export default function iHostStateToLanStateCurtain(iHostState: IHostStateInterface) {
    const MOTOR_CONTROL_MAP = {
        open: 'open',
        close: 'close',
        stop: 'pause',
    };

    const lanState = {};
    const percentage = _.get(iHostState, ['percentage']);
    if (percentage) {
        _.assign(lanState, {
            openPercent: percentage.percentage,
        });
    }

    const motorControl = _.get(iHostState, ['motor-control']);
    if (motorControl) {
        _.assign(lanState, {
            curtainAction: MOTOR_CONTROL_MAP[motorControl.motorControl],
        });
    }
    return lanState;
}