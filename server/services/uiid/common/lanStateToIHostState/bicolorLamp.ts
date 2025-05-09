import { ILanStateBicolorLamp } from "../../../../ts/interface/ILanState";
import _ from "lodash";

export default function lanStateToIHostStateByBicolorLamp(lanState: ILanStateBicolorLamp) {
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);
    if (switchState !== null) {
        _.merge(iHostState, {
            power: {
                powerState: switchState,
            },
        });
    }

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