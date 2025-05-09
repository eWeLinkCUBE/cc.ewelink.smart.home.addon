import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import IEWeLinkDevice from "../../../ts/interface/IEWeLinkDevice";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
/** 双通道开关 (Dual channel switch) */
export default class Uiid2256 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_2256;

    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.MULTI_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
        ],
    }
}