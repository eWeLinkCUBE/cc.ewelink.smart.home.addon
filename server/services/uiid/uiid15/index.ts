import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import iHostStateToLanState from "../common/iHostStateToLanState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { Request } from "express";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import { decode } from "js-base64";
import { IReqData } from "../../../ts/interface/IReqData";
import controlDeviceByLan from "../common/controlDeviceByLan";
import { createFailResModeError } from "../common/controlDeviceByLan/utils/createRes";
import updateLanDeviceData from "../../public/updateLanDeviceData";
import categoryAndCapabilities from "../common/categoryAndCapabilities";
import ICategoryAndCapabilities from "../../../ts/interface/ICategoryAndCapabilities";

/** 恒温恒湿改装件 (Constant temperature and humidity modification parts)*/
export default class Uiid15 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_15;

    protected _controlMode = EDeviceControlMode.LAN_AND_WAN;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected override _getTemperatureUnitWhenGenerateTags() {
        let temperature_unit;
        const temperatureUnit = _.get(this._eWeLinkDeviceData!.itemData.tags, 'temperatureUnit', null);
        if (temperatureUnit) {
            temperature_unit = temperatureUnit === 'centigrade' ? 'c' : 'f';
        }
        return temperature_unit
    }

    protected override _defaultCategoryAndCapabilities: ICategoryAndCapabilities = {
        category: ECategory.SWITCH,
        capabilities: [
            {
                capability: ECapability.POWER,
                permission: EPermission.UPDATE_UPDATED
            },
            {
                capability: ECapability.TEMPERATURE,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.HUMIDITY,
                permission: EPermission.UPDATED,
            },
            {
                capability: ECapability.MODE,
                permission: EPermission.UPDATE_UPDATED,
                name: 'thermostatMode',
                settings: {
                    supportedValues: {
                        type: "enum",
                        permission: "01",
                        values: ["auto", "manual"]// 自定义模式值，如果配置则全部覆盖
                    },
                }
            },
        ],
    }

    protected override _getCategoryAndCapabilities() {
        let { capabilities } = this._defaultCategoryAndCapabilities;
        capabilities = categoryAndCapabilities.getCapabilitiesBy181And15(capabilities, this._eWeLinkDeviceData!);
        return {
            capabilities, category: this._defaultCategoryAndCapabilities.category
        }
    }


    protected override _lanStateToIHostStateMiddleware(lanState: any) {
        const iHostState = {}
        _.assign(iHostState, lanStateToIHostState.uiid181And15(lanState));
        const deviceType = _.get(lanState, 'deviceType', null);
        if (deviceType !== null) {
            _.assign(iHostState, {
                // deviceType模式 --- temperature温度控制，humidity湿度控制，normal正常，即手动控制开关状态
                // deviceType mode ---temperature temperature control, humidity control, normal, that is, manual control switch status
                mode: {
                    thermostatMode: {
                        modeValue: deviceType === 'normal' ? 'manual' : 'auto',
                    },
                },
            });
        }
        return iHostState
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = iHostStateToLanState.getSingleProtocolLanState(iHostState);
        const newLanState = {
            mainSwitch: _.get(lanState, 'switch', 'on'),
            deviceType: 'normal',
        };
        return newLanState;
    }

    protected override async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const reqData = req.body as IReqData;
        const { header, endpoint } = reqData.directive;
        const { message_id } = header;
        const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

        const { deviceId } = iHostDeviceData;

        if (isWrongModeToControl(deviceId)) {
            controlDeviceByLan.utils
            return createFailResModeError(message_id);
        }

        const lanRequest = updateLanDeviceData.setSwitch
        const lanState = this._iHostStateToLanState(iHostState)
        return controlDeviceByLan.request(req, lanRequest, lanState)
    }
}


function isWrongModeToControl(deviceId: string) {
    const lanState = deviceDataUtil.getLastLanState(deviceId);
    const deviceType = _.get(lanState, 'deviceType', null);

    //自动模式 (automatic mode)
    if (deviceType !== null) {
        return deviceType !== 'normal';
    }
    return false;
}