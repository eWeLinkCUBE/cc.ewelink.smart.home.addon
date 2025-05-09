import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import logger from "../../../log";
import getEWeLinkDevice from "../../public/getEWeLinkDevice";
import { ILanStateElectricDevice } from "../../../ts/interface/ILanState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import { Request } from "express";
import getDayKwsDataByLan from "./getDayKwsDataByLan";
import getDayKwsDataByWan from "./getDayKwsDataByWan";



/** 功率检测插座过载告警 -- 多通道协议 (Power detection socket overload alarm --multi-channel protocol)*/
export default class Uiid182 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_182;

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
                        value: 3600 * 24,
                    },
                    timeZoneOffset: {
                        permission: "01",
                        type: "numeric",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
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
            capabilities, category: this._defaultCategoryAndCapabilities.category,
        }
    }

    protected async _getEWeLinkDevice() {
        const timeZone = _.get(this._eWeLinkDeviceData, ['itemData', 'params', 'timeZone'], null);
        if (timeZone === null) {
            await getEWeLinkDevice(this._deviceId);
        }
    }


    protected _lanStateToIHostStateMiddleware(lanState: ILanStateElectricDevice) {
        return lanStateToIHostState.power(lanState, 100);
    }


    protected override async _queryLanDeviceStates(req: Request) {
        return await getDayKwsDataByLan(req);
    }

    protected override async _queryWanDeviceStates(req: Request) {
        return await getDayKwsDataByWan(req);
    }
}