import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import { ILanState11 } from "../../../ts/interface/ILanState";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import deviceDataUtil from "../../../utils/deviceDataUtil";

/** 电动窗帘*/
export default class Uiid11 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_11;

    protected _controlMode = EDeviceControlMode.WAN;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.PERCENTAGE,
                permission: EPermission.UPDATE_UPDATED,
                settings: {
                    percentageRange: {
                        permission: "01",
                        type: "numeric",
                        min: 0,
                        max: 100,
                        step: 1
                    }
                }
            },
        ],
    }



    protected override _lanStateToIHostStateMiddleware(lanState: ILanState11) {
        const iHostState = {};

        const percentage = _.get(lanState, 'setclose', null);

        if (percentage !== null) {
            _.merge(iHostState, {
                percentage: {
                    percentage,
                },
            });
        }

        const motorTurn = _.get(lanState, 'switch', null); //0-电机停止；1-电机正传；2-电机反转 (0:Motor stops; 1:Motor forwards; 2:Motor reverses)
        const motorTurnObj = {
            pause: 'stop',
            on: 'open',
            off: 'close',
        };

        if (motorTurn !== null) {
            _.assign(iHostState, {
                'motor-control': {
                    motorControl: motorTurnObj[motorTurn],
                },
            });
        }

        _.assign(iHostState, {
            //normal 表示正常模式（已校准），calibration 表示正在校准。默认校准
            //normal Indicates normal mode (calibrated），calibration Indicates calibration is in progress。Default calibration
            'motor-clb': {
                motorClb: 'normal',
            },
        });

        return iHostState;
    }


    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {};


        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(this._deviceId);
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            return {};
        }

        if (_.isEmpty(iHostState)) {
            return {};
        }
        const motorControlObj = _.get(iHostState, 'motor-control');
        const percentageObj = _.get(iHostState, ['percentage']);

        if (motorControlObj) {
            const motorControlMapObj = {
                open: 'on',
                stop: 'pause',
                close: 'off',
            };
            const proxy = controlDevice(device, 'controlCurtain', { switch: motorControlMapObj[motorControlObj.motorControl] as 'on' | 'pause' | 'off' });
            _.assign(lanState, proxy);
        }

        if (percentageObj) {
            const proxy = controlDevice(device, 'controlCurtain', { setclose: percentageObj.percentage });
            _.assign(lanState, proxy);
        }
        return lanState;
    }


}