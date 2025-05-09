import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { ILanStateTemAndHum } from "../../../ts/interface/ILanState";
import getEWeLinkDevice from "../../public/getEWeLinkDevice";

/** 温湿度传感器 (Temperature and humidity sensor)*/
export default class Uiid1770 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_1770;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected override _getTemperatureUnitWhenGenerateTags() {
        let temperature_unit;
        const templateUnit = _.get(this._eWeLinkDeviceData!.itemData.tags, 'templateUnit', null);
        if (templateUnit) {
            temperature_unit = templateUnit;
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

    protected override async _generateIHostStateWhenSync(lanState: any) {
        const iHostState = await super._generateIHostStateWhenSync(lanState);
        //拿云端数据 (Get cloud data)
        if (_.get(lanState, 'temperature', null) === null || _.get(lanState, 'humidity', null) === null) {
            await getEWeLinkDevice(this._deviceId);
        }

        if (_.get(lanState, 'temperature', null) === null) {
            const temperature = (this._eWeLinkDeviceData!.itemData.params?.temperature / 100).toFixed(1);
            _.set(iHostState, 'temperature.temperature', Number(temperature));
        }
        if (_.get(lanState, 'humidity', null) === null) {
            const humidity = (this._eWeLinkDeviceData!.itemData.params?.humidity / 100).toFixed(0);
            _.set(iHostState, 'humidity.humidity', Number(humidity));
        }
        return iHostState;
    }
}