import IEWeLinkDevice from "../../../../ts/interface/IEWeLinkDevice";
import { ILanStateFiveColorLamp } from "../../../../ts/interface/ILanState";
import { hsvToRgb } from "../../../../utils/colorUtils";
import _ from "lodash";

export default function lanStateToIHostStateByFiveColorLamp(lanState: ILanStateFiveColorLamp, eWeLinkDeviceData: IEWeLinkDevice) {
    /**
     * zigbee-p 网关固件版本：1.7.1
     * 五色灯切换彩光模式时，需要将 hue 和 saturation 转换成 rgb，
     * zigbee-p gateway firmware version: 1.7.1
     * When the five-color lamp switches modes, no colorMode field sse is reported.
     * Obtain the current colorMode from cloud data when controlling the brightness of five-color lights,
     */
    const iHostState = {};

    const switchState = _.get(lanState, 'switch', null);
    if (switchState !== null) {
        _.merge(iHostState, {
            power: {
                powerState: switchState,
            },
        });
    }

    const setBrightness = (brightness: number | null) => {
        !!brightness && _.merge(iHostState, { brightness: { brightness } });
    };

    // 如果五色灯在 zigbee-p 网关中无色温数据时会获取到 colorTemp: 65535 (If the five-color lamp has no color temperature data in the zigbee-p gateway, colorTemp: 65535 will be obtained.)
    const colorTemp = _.get(lanState, 'colorTemp', null);
    if (colorTemp !== null && colorTemp >= 0 && colorTemp <= 100) {
        _.merge(iHostState, {
            'color-temperature': {
                colorTemperature: colorTemp,
            },
        });
    }

    // 因为局域网只单独上报了saturation和hue,所以需要从拿云端数据补齐 (Because the LAN only reports saturation and hue separately, it needs to be supplemented with data from the cloud.)
    // 五色灯同步 saturation 取值范围 [0, 100] (Five-color light synchronization saturation value range [0, 100])
    const saturation = _.get(lanState, 'saturation', null);
    if (saturation !== null && saturation >= 0 && saturation <= 100) {
        const hue = _.get(eWeLinkDeviceData, ['itemData', 'params', 'hue'], null);
        if (hue !== null && hue >= 0 && hue <= 359) {
            const [red, green, blue] = hsvToRgb(hue, saturation);
            _.merge(iHostState, {
                'color-rgb': { red, green, blue },
            });
        }
    }

    // 五色灯同步 hue 取值范围 [0, 359] (Five-color lamp hue value range [0, 359])
    const hue = _.get(lanState, 'hue', null);
    if (hue !== null && hue >= 0 && hue <= 359) {
        const saturation = _.get(eWeLinkDeviceData, ['itemData', 'params', 'saturation'], null);
        const [red, green, blue] = hsvToRgb(hue, saturation ?? 100);
        _.merge(iHostState, {
            'color-rgb': { red, green, blue },
        });
    }
    // 取当前模式下的亮度 （Get the brightness in the current mode）
    const colorMode = _.get(lanState, 'colorMode', null);

    const cctBrightness = _.get(lanState, 'cctBrightness', null);
    if (cctBrightness !== null && (colorMode === 'cct' || colorMode === null)) {
        setBrightness(cctBrightness);
    }

    const rgbBrightness = _.get(lanState, 'rgbBrightness', null);
    if (rgbBrightness !== null && (colorMode === 'rgb' || colorMode === null)) {
        setBrightness(rgbBrightness);
    }

    return iHostState;
}