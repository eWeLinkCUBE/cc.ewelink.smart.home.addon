import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateMotionSensor7002 } from "../../../ts/interface/ILanState";

/** 运动传感器 (motion sensor)*/
export default class Uiid7002 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7002;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.MOTION_SENSOR,
        capabilities: [
            { capability: ECapability.MOTION, permission: EPermission.UPDATED },
            { capability: ECapability.ILLUMINATION_LEVEL, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateMotionSensor7002) {
        const iHostState = lanStateToIHostState.motionSensor(lanState, this._iHostDeviceData);
        // uiid 7002 移动传感器需要同步光照等级数据 (uiid 7002 motion sensor need to sync illumination-level data)
        const brState = _.get(lanState, 'brState', null);
        if (brState !== null) {
            _.merge(iHostState, {
                'illumination-level': {
                    level: brState,
                },
            });
        }
        return iHostState;
    }
}