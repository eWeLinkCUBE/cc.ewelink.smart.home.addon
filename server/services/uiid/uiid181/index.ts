import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { ILanState181and15 } from "../../../ts/interface/ILanState";
import categoryAndCapabilities from "../common/categoryAndCapabilities";
import ICategoryAndCapabilities from "../../../ts/interface/ICategoryAndCapabilities";


/** 恒温恒湿改装件 (Constant temperature and humidity modification parts)*/
export default class Uiid181 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_181;

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

    /** 设备上报、同步设备时 iHostState 的转换方法 */
    protected override _lanStateToIHostStateMiddleware(lanState: ILanState181and15) {
        const iHostState = {}
        _.assign(iHostState, lanStateToIHostState.uiid181And15(lanState));
        const autoControlEnabled = _.get(lanState, 'autoControlEnabled', null);

        if (autoControlEnabled !== null) {
            _.assign(iHostState, {
                // 0 手动，1 自动。 ( 0 manual, 1 automatic)
                mode: {
                    thermostatMode: {
                        modeValue: autoControlEnabled === 0 ? 'manual' : 'auto',
                    },
                },
            });
        }
        return iHostState
    }

}