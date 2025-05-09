import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateTemAndHum } from "../../../ts/interface/ILanState";

/** 温湿度传感器 (Temperature and humidity sensor)*/
export default class Uiid7014 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7014;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected override _getTemperatureUnitWhenGenerateTags() {
        let temperature_unit;
        // 0: 摄氏度，1: 华氏度
        // 0: Celsius, 1: Fahrenheit
        const templateUnit = _.get(this._eWeLinkDeviceData!.itemData, 'params.tempUnit', null);
        if (templateUnit !== null) {
            temperature_unit = templateUnit === 1 ? 'f' : 'c';
        }
        return temperature_unit;
    }


    protected _defaultCategoryAndCapabilities = {
        category: ECategory.TEMPERATURE_AND_HUMIDITY_SENSOR,
        capabilities: [
            { capability: ECapability.TEMPERATURE, permission: EPermission.UPDATED },
            { capability: ECapability.HUMIDITY, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanStateTemAndHum) {
        return lanStateToIHostState.temAndHum(lanState);
    }
}