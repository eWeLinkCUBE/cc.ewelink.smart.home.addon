import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";

/** 单通道插座 (single channel socket)*/
export default class Uiid1009 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1009;

    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.SINGLE_PROTOCOL; 

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.PLUG,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED }],
    }
}