
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import BaseDeviceOperate from "../baseDeviceOperate";

/** Zigbee-U Matter网关 (Zigbee-U Matter Gateway) */
export default class Uiid1000 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_243;

    constructor(deviceId: string) {
        super(deviceId);
    }

    // TODO: 待补充，可以将查询子设备数量的方法封装进来
}