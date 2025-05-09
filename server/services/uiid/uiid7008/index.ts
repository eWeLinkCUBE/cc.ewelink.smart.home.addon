import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";

/** 双色灯 (bicolor lamp)*/
/** zigbee 设备 */
export default class Uiid7008 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7008;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: any, iHostState: any = {}) {
        /**
         * uiid 7008 同步时获取到的亮度字段为：cctBrightness (uiid 7008 The brightness field obtained during synchronization is: cctBrightness)
         * sse 同步亮度消息时字段为：brightness (When sse synchronizes brightness messages, the field is: brightness)
         */
        const brightness = _.get(lanState, 'brightness', null) ?? _.get(lanState, 'cctBrightness', null);
        if (brightness !== null) {
            _.merge(iHostState, {
                brightness: {
                    brightness,
                },
            });
        }

        const colorTemp = _.get(lanState, 'colorTemp', null);
        if (colorTemp !== null && colorTemp >= 0 && colorTemp <= 100) {
            _.merge(iHostState, {
                'color-temperature': {
                    colorTemperature: colorTemp,
                },
            });
        }

        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {};

        // 控制亮度需要将 switch: 'on' 参数同时下发 (To control the brightness, you need to send the switch: 'on' parameter at the same time.)
        const brightness = _.get(iHostState, ['brightness', 'brightness'], null);
        if (brightness !== null) {
            _.merge(lanState, {
                brightness,
                switch: 'on',
            });
        }

        // 控制色温需要将 switch: 'on' 参数同时下发 (To control color temperature, you need to send the switch: 'on' parameter at the same time.)
        const colorTemp = _.get(iHostState, ['color-temperature', 'colorTemperature'], null);
        if (colorTemp !== null) {
            _.merge(lanState, {
                colorTemp,
                switch: 'on',
            });
        }

        return lanState;
    }
}