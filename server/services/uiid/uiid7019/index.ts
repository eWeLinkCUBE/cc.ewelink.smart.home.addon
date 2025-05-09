import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStateWaterSensor } from "../../../ts/interface/ILanState";
import lanStateToIHostState from "../common/lanStateToIHostState";

/** 水浸 (water immersion sensor)*/
export default class Uiid7019 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7019;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.WATER_LEAK_DETECTOR,
        capabilities: [
            { capability: ECapability.WATER_LEAK, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateWaterSensor) {
        return lanStateToIHostState.waterSensor(lanState, this._iHostDeviceData);
    }
}