import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStateMotionSensor } from "../../../ts/interface/ILanState";
import lanStateToIHostState from "../common/lanStateToIHostState";

/** 运动传感器 (motion sensor) */
export default class Uiid2026 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_2026;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.MOTION_SENSOR,
        capabilities: [{ capability: ECapability.MOTION, permission: EPermission.UPDATED }],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateMotionSensor) {
        return lanStateToIHostState.motionSensor(lanState);
    }
}