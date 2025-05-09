import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStateMultiPress } from "../../../ts/interface/ILanState";
import lanStateToIHostState from "../common/lanStateToIHostState";

/** Zigbee 4 通道场景开关 (Zigbee 4 channel scene switch) */
export default class Uiid1006 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1006;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.BUTTON,
        capabilities: [
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '5' },
            { capability: ECapability.MULTI_PRESS, permission: EPermission.UPDATED, name: '6' },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateMultiPress) {
        return lanStateToIHostState.multiPress(lanState);
    }

}