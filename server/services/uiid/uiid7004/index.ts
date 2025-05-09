import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";

/** 单通道开关 (single channel switch)*/
export default class Uiid7004 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7004;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.SWITCH,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED }],
    }
}