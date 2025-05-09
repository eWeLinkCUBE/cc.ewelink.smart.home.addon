import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";

/** 三通道开关 -- 轻智能 (Three-channel switch --light intelligence) */
export default class Uiid162 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_162;

    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.MULTI_PROTOCOL;

    protected _controlMode: EDeviceControlMode = EDeviceControlMode.LAN_AND_WAN;


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