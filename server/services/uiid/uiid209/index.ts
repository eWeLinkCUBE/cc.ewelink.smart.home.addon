import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";

/** 单通道触摸开关 (Single channel touch switch) */
export default class Uiid209 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_209;

    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.SINGLE_MULTI_PROTOCOL;

    protected _controlMode: EDeviceControlMode = EDeviceControlMode.LAN;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.SWITCH,
        capabilities: [{ capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED }],
    }
}