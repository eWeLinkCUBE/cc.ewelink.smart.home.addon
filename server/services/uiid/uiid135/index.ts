import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import iHostStateToLanState from "../common/iHostStateToLanState";
import _ from 'lodash';
import { Request } from "express";
import { IHostStateInterface } from "../../../ts/interface/IHostState";

/** 双色冷暖灯_支持2.4G轻智能 (Dual-color heating and cooling lamp supports 2.4g light intelligence)*/
export default class Uiid135 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_135;

    protected _controlMode = EDeviceControlMode.LAN;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

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
        const ctValue = ltype !== null ? _.get(lanState, [ltype, 'ct'], null) : null;
        return _.assign(iHostState, lanStateToIHostState.light(lanState, ctValue));
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: any) {
        const lanState: any = {};
        const ct = iHostState['color-temperature']?.colorTemperature;
        _.assign(lanState, iHostStateToLanState.light(iHostState, this._deviceId, ct))
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