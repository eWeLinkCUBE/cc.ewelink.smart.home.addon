import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";

/** 单色灯 (Monochrome lamp)*/
export default class Uiid1257 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1257;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: any, iHostState: any = {}) {
        const brightness = _.get(lanState, 'brightness', null);
        if (brightness !== null) {
            _.merge(iHostState, {
                brightness: {
                    brightness,
                },
            });
        }
        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {};
        const brightness = _.get(iHostState, ['brightness', 'brightness'], null);
        if (brightness !== null) {
            _.merge(lanState, {
                brightness,
                switch: 'on',
            });
        }
        return lanState;
    }
}