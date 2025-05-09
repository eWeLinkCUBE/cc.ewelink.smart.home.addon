import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateMultiPress } from "../../../ts/interface/ILanState";

/** Zigbee 3 通道场景开关 (Zigbee 3 channel scene switch)*/
export default class Uiid1003 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1003;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '3' },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateMultiPress) {
        return lanStateToIHostState.multiPress(lanState);
    }
}