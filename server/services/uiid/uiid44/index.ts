import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { ILanState44 } from "../../../ts/interface/ILanState";

/** 单路调光灯 (Single channel dimming light)*/
export default class Uiid44 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_44;

    protected _controlMode = EDeviceControlMode.LAN;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED }
        ]
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState44, iHostState: any = {}) {
        const brightness = _.get(lanState, 'brightness');
        brightness && _.assign(iHostState, { brightness: { brightness } });
        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: any) {
        const lanState: any = {};
        const brightnessObj = _.get(iHostState, 'brightness', null);
        brightnessObj && _.assign(lanState, {
            brightness: brightnessObj.brightness,
            switch: 'on',
            mode: 0,
        });
        return lanState;
    }
}
