import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStateSmokeDetector } from "../../../ts/interface/ILanState";
import lanStateToIHostState from "../common/lanStateToIHostState";

/** 烟感 (smoke sensor) */
export default class Uiid5026 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_5026;

    protected _lanState!: ILanStateSmokeDetector;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.SMOKE_DETECTOR,
        capabilities: [
            { capability: ECapability.SMOKE, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateSmokeDetector) {
        return lanStateToIHostState.smokeDetector(lanState, this._iHostDeviceData);
    }
}