import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";

/** Zigbee电量统计插座-单通道协议 (Zigbee power statistics socket - single channel protocol)*/
export default class Uiid7020 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7020;

    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.PLUG,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED }],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: any) {
        return lanStateToIHostState.getSingleProtocolIHostState(lanState, powerState => powerState ? 'on' : 'off');
    }
    
    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        return iHostStateToLanState.getSingleProtocolLanState(iHostState, powerState => powerState === 'on')
    }
}