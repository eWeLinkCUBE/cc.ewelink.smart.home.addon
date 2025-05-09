import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { ILanStateElectricDevice } from "../../../ts/interface/ILanState";
import { Request } from "express";
import getWebSocketDayKwsData from "./getWebSocketDayKwsData";
import getWebSocketRealSummarize from "./getWebSocketRealSummarize";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import webSocketRealSummarizeStartEnd from './webSocketRealSummarizeStartEnd'
import controlDeviceByLan from "../common/controlDeviceByLan";

/** 功率检测单通道插座 (Power detection single channel socket) */
export default class Uiid5 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_5;


    protected _controlMode = EDeviceControlMode.WAN;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected override _defaultCategoryAndCapabilities = {
        category: ECategory.PLUG,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.ELECTRIC_POWER,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED_QUERY,
                settings: {
                    resolution: {
                        permission: "01",
                        type: "numeric",
                        value: 86400,
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
            capabilities, category: this._defaultCategoryAndCapabilities.category
        }
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateElectricDevice) {
        const iHostState = {}

        _.assign(iHostState, lanStateToIHostState.power(lanState, 1));

        const startTime = _.get(lanState, 'startTime', null);

        const endTime = _.get(lanState, 'endTime', '');

        const oneKwh = _.get(lanState, 'oneKwh', null);

        if (startTime !== null && oneKwh !== null) {
            _.merge(iHostState, {
                'power-consumption': {
                    powerConsumption: {
                        rlSummarize: endTime === '',
                        timeRange: {
                            start: startTime,
                            end: endTime,
                        },
                    },
                },
            });
        }

        return iHostState;
    }
    protected override async _queryWanDeviceStates(req: Request) {
        const { iHostState } = controlDeviceByLan.utils.getReqInfo(req)
        const type = _.get(iHostState, ['power-consumption', 'type'], null);

        if (type === 'summarize') {
            return await getWebSocketDayKwsData(req);
        } else if (type === 'rlSummarize') {
            return await getWebSocketRealSummarize(req);
        }
        return super._queryWanDeviceStates(req)
    }

    protected override async _updateWanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const rlSummarize = _.get(iHostState, ['power-consumption', 'powerConsumption', 'rlSummarize'], null);
        //实时电量开始或者结束接口 （Real-time battery start or end api）
        if (rlSummarize !== null) {
            return await webSocketRealSummarizeStartEnd(req);
        }
        return super._updateWanDeviceStates(req, iHostState)
    }




}