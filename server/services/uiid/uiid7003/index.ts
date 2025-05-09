import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateContactSensorWithTamperAlert } from "../../../ts/interface/ILanState";

/** 门磁 (Door magnet) */
export default class uiid_7003 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7003;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.CONTACT, permission: EPermission.UPDATED },
            { capability: ECapability.TAMPER_ALERT, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateContactSensorWithTamperAlert) {
        const iHostState = lanStateToIHostState.contactSensor(lanState, this._iHostDeviceData);
        // 在zigbee-P上，局域网sse和 websocket 都上报了 “被装上” 和 “被拆下” (On zigbee-P, both LAN SSE and websocket reported "mounted" and "removed")
        // 在zigbee-U上，websocket只上报了 “被拆下”(On zigbee-U, websocket only reports "removed")

        // 检测到拆除，split 字段存在时值只能为1 (When demolition is detected, the value of split field can only be 1 when it exists.)
        const split = _.get(lanState, 'split', null);
        if (split !== null) {
            _.merge(iHostState, {
                'tamper-alert': {
                    tamper: split === 1 ? 'detected' : 'clear',
                },
            });
        }
        return iHostState;
    }
}