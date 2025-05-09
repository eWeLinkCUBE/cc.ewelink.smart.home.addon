import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";

/** Zigbee电量统计插座-双通道协议 (Zigbee power statistics socket - dual channel protocol)*/
export default class Uiid7021 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7021;

    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.MULTI_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: any) {
        const toggle: Record<number, { toggleState: string }> = {};
        for (const key in lanState) {
            if (!key.startsWith('switch_')) continue;
            toggle[parseInt(key.split('_')[1]) + 1] = {
                toggleState: lanState[key] ? 'on' : 'off',
            };
        }
        return {
            toggle
        }
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const power = _.get(iHostState, 'power');
        const lanState = {};
        if (power) {
            for (let i = 0; i < this._toggleLength; i++) {
                _.set(lanState, `switch_0${i}`, power.powerState === 'on');
            }
        } else {
            const toggleObj = _.get(iHostState, 'toggle');
            if (toggleObj) {
                for (const toggleIndex in toggleObj) {
                    _.set(lanState, `switch_0${parseInt(toggleIndex) - 1}`, toggleObj[toggleIndex].toggleState === 'on');
                }
            }
        }
        return lanState;
    }
}