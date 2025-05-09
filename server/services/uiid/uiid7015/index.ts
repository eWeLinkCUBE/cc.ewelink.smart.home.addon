import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateCurtain } from "../../../ts/interface/ILanState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import iHostStateFormatter from "../common/iHostStateFormatter";

/** 窗帘 (curtain) */
export default class Uiid7006 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7015;

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
            },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateCurtain) {
        const iHostState = lanStateToIHostState.curtain(lanState);
        const curPercent = _.get(lanState, 'curPercent', null);

        const eWeLinkUpperLimitState = _.get(this._eWeLinkDeviceData, ['itemData', 'params', 'upperLimitState'], null);
        const eWeLinkLowerLimitState = _.get(this._eWeLinkDeviceData, ['itemData', 'params', 'lowerLimitState'], null);

        const upperLimitState = _.get(lanState, 'upperLimitState', eWeLinkUpperLimitState);
        const lowerLimitState = _.get(lanState, 'lowerLimitState', eWeLinkLowerLimitState);

        // 上限位校准状态 String	"calibrated "：已校准"uncalibrated"：未校准 (Upper limit calibration status String "calibrated ": calibrated "uncalibrated": not calibrated)
        if (upperLimitState === 'calibrated' && lowerLimitState === 'calibrated') {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb: 'normal',
                },
            });
        } else {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb: 'calibration',
                },
            });
        }
        if (curPercent === 255) {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb: 'calibration',
                },
            });
        }
        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        return iHostStateToLanState.curtain(iHostState);
    }

    protected override async _generateIHostStateWhenSync(lanState: ILanStateCurtain) {
        let iHostState = await super._generateIHostStateWhenSync(lanState);
        iHostState = await iHostStateFormatter.curtain(this._deviceId, this._eWeLinkDeviceData, iHostState);
        // 进度状态 (progress status)
        const curPercent = _.get(this._eWeLinkDeviceData, 'itemData.params.curPercent', null);
        // 7015 窗帘的校准状态上报异常，未校准时上报 motorClb: 'normal' 且 curPercent: 255。
        // 7015 The calibration status of the curtain is abnormal. When it is not calibrated, motorClb: 'normal' and curPercent: 255 are reported.
        // 当前百分比为 255 时，将7015窗帘同步为未校准状态
        // When the current percentage is 255, synchronize the 7015 curtains to an uncalibrated state
        curPercent === 255 && _.set(iHostState, 'motor-clb.motorClb', 'calibration');
        return iHostState;
    }
}