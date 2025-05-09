import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStateCurtain } from "../../../ts/interface/ILanState";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import iHostStateFormatter from "../common/iHostStateFormatter";

/** 窗帘 (curtain)*/
export default class Uiid7006 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7006;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.PERCENTAGE,
                permission: EPermission.UPDATE_UPDATED,
            },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateCurtain) {
        const iHostState = lanStateToIHostState.curtain(lanState);
        const motorClb = _.get(lanState, 'motorClb', null);
        const battery = _.get(lanState, 'battery', null);

        if (motorClb !== null) {
            _.merge(iHostState, {
                'motor-clb': {
                    motorClb,
                },
            });
        }

        if (battery !== null) {
            _.merge(iHostState, {
                'battery': {
                    battery,
                },
            });
        }

        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        return iHostStateToLanState.curtain(iHostState);
    }

    protected override async _generateIHostStateWhenSync(lanState: ILanStateCurtain) {
        const iHostState = await super._generateIHostStateWhenSync(lanState);
        return await iHostStateFormatter.curtain(this._deviceId, this._eWeLinkDeviceData, iHostState);
    }
}