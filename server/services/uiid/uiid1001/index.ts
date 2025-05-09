import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateButton } from "../../../ts/interface/ILanState";

/** 无线按键 (wireless button) */
export default class Uiid1001 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1001;


    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.BUTTON,
        capabilities: [{ capability: ECapability.PRESS, permission: EPermission.UPDATED }],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateButton) {
        return lanStateToIHostState.uiid1000And7000And1001(lanState);
    }
}