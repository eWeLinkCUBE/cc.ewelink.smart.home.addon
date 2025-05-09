import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStateFiveColorLamp } from "../../../ts/interface/ILanState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { fiveColorLightFormatter } from '../common/iHostStateFormatter';
import lanStateToIHostState from '../common/lanStateToIHostState';
import iHostStateToLanState from '../common/iHostStateToLanState';

/** 五色灯 (five color lamp)*/
export default class Uiid3258 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_3258;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected async _generateIHostStateWhenSync(lanState = {}) {
        const iHostState = await super._generateIHostStateWhenSync(lanState);
        return fiveColorLightFormatter(iHostState, lanState, this._deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateFiveColorLamp, iHostState: any = {}) {
        if (this._eWeLinkDeviceData) {
            _.assign(iHostState, lanStateToIHostState.fiveColorLamp(lanState, this._eWeLinkDeviceData));
        }
        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        return iHostStateToLanState.zigbeeFiveColorLamp(iHostState, this._deviceId);
    }
}
