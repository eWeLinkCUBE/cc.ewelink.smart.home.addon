import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";

/** 三通道开关 (Three channel switch) */
export default class Uiid7012 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7012;

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
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '3' },
        ],
    }
}