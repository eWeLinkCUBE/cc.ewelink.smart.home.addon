import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import iHostStateToLanState from "../common/iHostStateToLanState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { toIntNumber } from "../../../utils/tool";
import { Request } from "express";
import { IHostStateInterface } from "../../../ts/interface/IHostState";

/** 双色冷暖灯 (双色冷暖灯)*/
export default class Uiid103 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_103;

    protected _controlMode = EDeviceControlMode.LAN_AND_WAN;

    protected _channelProtocolType = EChannelProtocol.OTHER;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED }
        ]
    }

    protected override _lanStateToIHostStateMiddleware(lanState: any, iHostState: any = {}) {
        const ltype = _.get(lanState, 'ltype', null);
        let ctValue = ltype !== null ? _.get(lanState, [ltype, 'ct'], null) : null;
        if (_.isNumber(ctValue)) ctValue = toIntNumber((ctValue / 255) * 100);
        _.assign(iHostState, lanStateToIHostState.light(lanState, ctValue));
        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: any) {
        const lanState: any = {};
        let ct = _.get(iHostState, [ECapability.COLOR_TEMPERATURE, 'colorTemperature'], null);
        if (_.isNumber(ct)) ct = toIntNumber((ct / 100) * 255);
        _.assign(lanState, iHostStateToLanState.light(iHostState, this._deviceId, ct));
        return lanState;
    }

    protected override async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const powerStateObj = _.get(iHostState, 'power', null);
        const brightnessObj = _.get(iHostState, 'brightness', null);
        if (powerStateObj && brightnessObj) {
            const powerIHostState = _.pick(iHostState, 'power');
            const res = await super._updateLanDeviceStates(req, powerIHostState);
            const lightIHostState = _.omit(iHostState, 'power');
            await super._updateLanDeviceStates(req, lightIHostState);
            return res
        }
        return super._updateLanDeviceStates(req, iHostState)
    }

    // 开关和亮度色温颜色需要分开下发（Switches and brightness, color temperature and colors need to be separately released）
    protected override async _updateWanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const powerStateObj = _.get(iHostState, 'power', null);
        const brightnessObj = _.get(iHostState, 'brightness', null);
        if (powerStateObj && brightnessObj) {
            const powerIHostState = _.pick(iHostState, 'power');
            const res = await super._updateWanDeviceStates(req, powerIHostState);
            const lightIHostState = _.omit(iHostState, 'power');
            await super._updateWanDeviceStates(req, lightIHostState);
            return res
        }
        return super._updateWanDeviceStates(req, iHostState)
    }
}