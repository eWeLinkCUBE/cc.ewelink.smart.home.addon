import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import { ILanState130 } from "../../../ts/interface/ILanState";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import logger from "../../../log";
import { toIntNumber } from "../../../utils/tool";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import getEWeLinkDevice from "../../public/getEWeLinkDevice";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import { Request } from 'express';
import deviceStateUtil from "../../../utils/deviceStateUtil";
import { createFailNotSupportedInterface } from "../common/controlDeviceByLan/utils/createRes";
import controlDeviceByLan from "../common/controlDeviceByLan";
import getWebSocketRealSummarizeToggle from "./getWebSocketRealSummarizeToggle";
import getWebSocketDayKwsDataToggle from "./getWebSocketDayKwsDataToggle";
import webSocketRealSummarizeStartEndToggle from "./webSocketRealSummarizeStartEndToggle";
import updateLanDeviceData from "../../public/updateLanDeviceData";
import toUpdateIHostTags from './toUpdateIHostTags'

/** 堆叠式电表四通道开关子设备 (Stacked meter four-channel switch sub-equipment) */
export default class Uiid extends BaseDeviceOperate {
    static uiid = EUiid.uiid_130;

    protected _controlMode = EDeviceControlMode.LAN_AND_WAN;

    protected _channelProtocolType = EChannelProtocol.MULTI_PROTOCOL;


    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '3' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '4' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.TOGGLE_VOLTAGE, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.TOGGLE_ELECTRIC_CURRENT, permission: EPermission.UPDATED, name: '4' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '1' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '2' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '3' },
            { capability: ECapability.TOGGLE_ELECTRIC_POWER, permission: EPermission.UPDATED, name: '4' },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED_QUERY,
                name: '1',
                settings: {
                    resolution: {
                        type: "numeric",
                        permission: "01",
                        value: 86400,
                    },
                    timeZoneOffset: {
                        type: "numeric",
                        permission: "01",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED_QUERY,
                name: '2',
                settings: {
                    resolution: {
                        type: "numeric",
                        permission: "01",
                        value: 86400,
                    },
                    timeZoneOffset: {
                        type: "numeric",
                        permission: "01",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED_QUERY,
                name: '3',
                settings: {
                    resolution: {
                        type: "numeric",
                        permission: "01",
                        value: 86400,
                    },
                    timeZoneOffset: {
                        type: "numeric",
                        permission: "01",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                },
            },
            {
                capability: ECapability.TOGGLE_POWER_CONSUMPTION,
                permission: EPermission.UPDATE_UPDATED_QUERY,
                name: '4',
                settings: {
                    resolution: {
                        type: "numeric",
                        permission: "01",
                        value: 86400,
                    },
                    timeZoneOffset: {
                        type: "numeric",
                        permission: "01",
                        min: -12,
                        max: 14,
                        value: 0
                    }
                }
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '1',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '2',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '3',
            },
            {
                capability: ECapability.TOGGLE_IDENTIFY,
                permission: EPermission.UPDATE_UPDATED,
                name: '4',
            },
        ],
    }

    protected override _getCategoryAndCapabilities() {
        let { capabilities } = this._defaultCategoryAndCapabilities;
        capabilities = capabilities.map((item) => {
            if (item.capability === ECapability.TOGGLE_POWER_CONSUMPTION) {
                const parentId = _.get(this._eWeLinkDeviceData, ['itemData', 'params', 'parentid'], null);
                const parentEWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(parentId);
                const timeZone = _.get(parentEWeLinkDeviceData, ['itemData', 'params', 'timeZone'], null);
                _.set(item, ['settings', 'timeZoneOffset', 'value'], timeZone)
            }
            return item;
        });
        return {
            capabilities,
            category: this._defaultCategoryAndCapabilities.category
        }
    }


    protected async _getEWeLinkDevice() {
        //时区在保存在网关里（The time zone is stored in the gateway）
        const parentId = _.get(this._eWeLinkDeviceData, ['itemData', 'params', 'parentid'], null);
        const parentEWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(parentId);
        const timeZone = _.get(parentEWeLinkDeviceData, ['itemData', 'params', 'timeZone'], null);
        if (timeZone === null) {
            logger.info('no timeZone-----------------', parentId);
            await getEWeLinkDevice(parentId);
        }
    }

    protected override async _getDeviceInfoWhenGenerateTags() {
        const deviceInfo = await super._getDeviceInfoWhenGenerateTags();
        _.set(deviceInfo, 'parentId', this._eWeLinkDeviceData!.itemData.params.parentid);
        return Promise.resolve(deviceInfo);
    }

    static updateIHostTags() {
        toUpdateIHostTags()
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState130) {

        const iHostState = {};

        const unitValue = 1;
        const channelList: number[] = [0, 1, 2, 3];
        channelList.forEach((channel: number) => {
            const name = channel + 1;

            const current = _.get(lanState, `current_0${channel}`, null);
            if (current !== null) {
                _.assign(iHostState, {
                    'toggle-electric-current': {
                        [name]: {
                            electricCurrent: toIntNumber(current * unitValue),
                        },
                    },
                });
            }

            const voltage = _.get(lanState, `voltage_0${channel}`, null);
            if (voltage !== null) {
                _.assign(iHostState, {
                    'toggle-voltage': {
                        [name]: {
                            voltage: toIntNumber(voltage * unitValue),
                        },
                    },
                });
            }

            const actPow = _.get(lanState, `actPow_0${channel}`, null);
            if (actPow !== null) {
                _.merge(iHostState, {
                    'toggle-electric-power': {
                        [name]: {
                            activePower: toIntNumber(actPow * unitValue),
                        },
                    },
                });
            }
            const apparentPow = _.get(lanState, `apparentPow_0${channel}`, null);
            if (apparentPow !== null) {
                _.merge(iHostState, {
                    'toggle-electric-power': {
                        [name]: {
                            apparentPower: toIntNumber(apparentPow * unitValue),
                        },
                    },
                });
            }
            const reactPow = _.get(lanState, `reactPow_0${channel}`, null);
            if (reactPow !== null) {
                _.merge(iHostState, {
                    'toggle-electric-power': {
                        [name]: {
                            reactivePower: toIntNumber(reactPow * unitValue),
                        },
                    },
                });
            }

            _.merge(iHostState, {
                'toggle-electric-power': {
                    [name]: {
                        electricPower: 0,
                    },
                },
            });


            const startTime = _.get(lanState, `startTime_0${channel}`, null);

            const endTime = _.get(lanState, `endTime_0${channel}`, '');

            if (startTime !== null) {
                _.merge(iHostState, {
                    'toggle-power-consumption': {
                        [name]: {
                            rlSummarize: endTime === '',
                            timeRange: {
                                start: startTime,
                                end: endTime,
                            },
                        },
                    },
                });
            }
        });

        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {};

        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(this._deviceId);
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            return {};
        }

        if (_.isEmpty(iHostState)) {
            return {};
        }

        const toggleIdentifyObj = _.get(iHostState, ['toggle-identify']);
        if (toggleIdentifyObj) {
            //通道索引（Channel index）
            const name = Object.keys(_.get(iHostState, ['toggle-identify']))[0];

            const channelIndex = Number(name) - 1;
            const proxy = controlDevice(device, 'refreshPowerInfo', { outlet: channelIndex });

            _.assign(lanState, proxy);
        }

        return lanState;
    }


    /** 
   * 查询设备历史数据,如果设备同时支持lan和wan，优先局域网控制，
   * 特殊的uiid（如130）只支持wan的，子类里覆盖
   * Query the device's historical data. If the device supports both lan and wan, priority will be given to LAN control.
   * Special uid (such as 130) only supports wan and is covered in subclasses
  */
    override async queryDeviceStates(req: Request) {
        const isInWsProtocol = deviceStateUtil.isInWsProtocol(this._deviceId);
        if (isInWsProtocol) {
            return this._queryWanDeviceStates(req)
        } else {
            return this._queryLanDeviceStates(req)
        }
    }

    /** 查询 wan 设备历史数据 */
    protected override async _queryWanDeviceStates(req: Request) {
        const { iHostState } = controlDeviceByLan.utils.getReqInfo(req)

        const togglePowerConsumption = _.get(iHostState, ECapability.TOGGLE_POWER_CONSUMPTION, null);
        if (JSON.stringify(togglePowerConsumption).indexOf('rlSummarize') > -1) {
            return await getWebSocketRealSummarizeToggle(req);
        } else {
            //summarize
            return await getWebSocketDayKwsDataToggle(req);
        }
    }

    /** 查询 lan 设备历史数据 */
    protected async _queryLanDeviceStates(req: Request): Promise<any> {
        const { message_id } = controlDeviceByLan.utils.getReqInfo(req)
        return createFailNotSupportedInterface(message_id)
    }



    /** 控制设备,优先长连接控制（Control equipment, priority long connection control） */
    override async updateDeviceStates(req: Request) {

        const { iHostState } = controlDeviceByLan.utils.getReqInfo(req)

        const isInWsProtocol = deviceStateUtil.isInWsProtocol(this._deviceId);
        if (isInWsProtocol) {
            return await this._updateWanDeviceStates(req, iHostState)
        } else {
            return await this._updateLanDeviceStatesCollect(req, iHostState)
        }
    }

    /** 控制 wan 设备 */
    protected async _updateWanDeviceStates(req: Request, iHostState: IHostStateInterface) {

        if (_.get(iHostState, ECapability.TOGGLE_POWER_CONSUMPTION)) {
            // 实时电量开始或者结束接口不支持局域网请求（The real-time battery start or end interface does not support LAN requests.）
            return await webSocketRealSummarizeStartEndToggle(req);
        }
        return super._updateWanDeviceStates(req, iHostState)
    }

    /** 控制 lan 设备 */
    protected async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const { message_id } = controlDeviceByLan.utils.getReqInfo(req)

        if (_.get(iHostState, ECapability.TOGGLE_POWER_CONSUMPTION)) {
            // 实时电量开始或者结束接口不支持局域网请求（The real-time battery start or end interface does not support LAN requests.）
            return createFailNotSupportedInterface(message_id)
        }

        const toggleIdentifyObj = _.get(iHostState, ECapability.TOGGLE_IDENTIFY)
        if (toggleIdentifyObj) {
            const lanRequest = updateLanDeviceData.spmSubDeviceUiActive
            const lanState = this._iHostStateToLanState(iHostState)
            const toggleIndex = Object.keys(toggleIdentifyObj)[0] ?? 1
            logger.info('toggleIndex--------------', toggleIndex)
            // 解决请求频繁导致设备不响应问题（Solve the problem of frequent requests causing the device to not respond）
            await controlDeviceByLan.utils.sleepMs(2000 * Number(toggleIndex))
            return controlDeviceByLan.request(req, lanRequest, lanState)
        }

        return super._updateLanDeviceStates(req, iHostState)
    }

}

