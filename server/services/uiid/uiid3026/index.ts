import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateContactSensor } from "../../../ts/interface/ILanState";

/** 门磁 (Door magnet)*/
export default class Uiid3026 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_3026;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.CONTACT_SENSOR,
        capabilities: [{ capability: ECapability.CONTACT, permission: EPermission.UPDATED }],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateContactSensor) {
        return lanStateToIHostState.contactSensor(lanState, this._iHostDeviceData);
    }
}