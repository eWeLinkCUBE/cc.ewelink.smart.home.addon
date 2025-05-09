import IEWeLinkDevice from "../../../../ts/interface/IEWeLinkDevice";
import _ from "lodash";
import { ILanState126And165 } from "../../../../ts/interface/ILanState";

/** 多通道设备 126、165 生成 iHostState 方法 */
export default function lanStateToIHostStateBy126And165(eWeLinkDeviceData: IEWeLinkDevice | null, lanState: ILanState126And165, toggleLength: number) {
    // const iHostState = getMultiProtocolIHostState(lanState as ILanStateMultipleSwitch, toggleLength);
    const iHostState: any = {};

    const currLocation = _.get(lanState, 'currLocation', null);
    if (currLocation !== null) {
        _.assign(iHostState, {
            percentage: {
                percentage: 100 - currLocation,
            },
        });
    }

    const motorTurn = _.get(lanState, 'motorTurn', null); //0-电机停止；1-电机正传；2-电机反转 (0:Motor stops; 1:Motor forwards; 2:Motor reverses)
    const motorTurnArr = ['stop', 'open', 'close'];
    if (motorTurn !== null) {
        _.assign(iHostState, {
            'motor-control': {
                motorControl: motorTurnArr[motorTurn],
            },
        });
    }

    const calibState = _.get(lanState, 'calibState', null);
    if (calibState !== null) {
        _.assign(iHostState, {
            //normal 表示正常模式（已校准），calibration 表示正在校准。
            //normal Indicates normal mode (calibrated），calibration Indicates calibration is in progress。
            'motor-clb': {
                motorClb: calibState === 0 ? 'calibration' : 'normal',
            },
        });
    }

    const lanWorkMode = _.get(lanState, 'workMode', null);
    const eWeLinkWorkMode = _.get(eWeLinkDeviceData, ['itemData', 'params', 'workMode'], null);
    const workMode = lanWorkMode ?? eWeLinkWorkMode;
    if (workMode !== 1) {
        iHostState.toggle && delete iHostState.toggle;
    } else {
        iHostState.percentage && delete iHostState.percentage;
        iHostState['motor-control'] && delete iHostState['motor-control'];
        iHostState['motor-clb'] && delete iHostState['motor-clb'];
    }

    if (_.isEmpty(iHostState?.toggle)) {
        iHostState.toggle && delete iHostState.toggle;
    }

    return iHostState;
}   