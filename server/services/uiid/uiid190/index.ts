import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import { ILanStateElectricDevice } from "../../../ts/interface/ILanState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import getKwsDataByLan from "./getKwsDataByLan";
import getKwsDataByWan from './getKwsDataByWan'
import { Request } from "express";

/** 单通道插座 (single channel socket)*/
export default class Uiid190 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_190;

    protected _channelProtocolType = EChannelProtocol.SINGLE_MULTI_PROTOCOL;

    protected _controlMode = EDeviceControlMode.LAN_AND_WAN;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.VOLTAGE, permission: EPermission.UPDATED },
            {
                capability: ECapability.ELECTRIC_CURRENT,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.UPDATED_QUERY,
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 3600,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            }
        ],
    }

    protected override _getCategoryAndCapabilities() {
        let { capabilities } = this._defaultCategoryAndCapabilities;
        const { _eWeLinkDeviceData: eWeLinkDeviceData } = this;
        capabilities = capabilities.map((item) => {
            if (item.capability === ECapability.POWER_CONSUMPTION) {
                _.set(item, ['settings', 'timeZoneOffset', 'value'], eWeLinkDeviceData && eWeLinkDeviceData.itemData.params?.timeZone)
            }
            return item;
        })
        return {
            capabilities, category: this._defaultCategoryAndCapabilities.category
        }
    }


    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateElectricDevice) {
        return lanStateToIHostState.power(lanState, 1)
    }

    protected _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        let lanState;
        const power = _.get(iHostState, ECapability.POWER, null);
        if (power) {
            lanState = {
                switches: [{
                    switch: power.powerState,
                    outlet: 0,
                }], operSide: 1
            };
        }
        return lanState;
    }


    protected override async _queryLanDeviceStates(req: Request) {
        return await getKwsDataByLan(req);
    }

    protected override async _queryWanDeviceStates(req: Request) {
        return await getKwsDataByWan(req)
    }

}