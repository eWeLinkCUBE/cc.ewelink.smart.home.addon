import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { brightMap } from "../../../constants/uiid22BrightMap";
import { ILanState22 } from "../../../ts/interface/ILanState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import percentTranslateToHundred from "../common/utils/percentTranslateToHundred";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import { rgbToHsv } from "../../../utils/colorUtils";
import ISmartHomeConfig from "../../../ts/interface/ISmartHomeConfig";
import utils from "../common/utils";

/** RGB五色球泡灯 (RGB five-color bulb) */
export default class Uiid22 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_22;

    protected _controlMode = EDeviceControlMode.WAN;

    protected _channelProtocolType = EChannelProtocol.OTHER;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected override _getSmartHomeConfigWhenGenerateTags() {
        const _smartHomeConfig: ISmartHomeConfig = {};
        _smartHomeConfig.colorTempUiType = 'button';
        return _smartHomeConfig;
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    }


    protected override _lanStateToIHostStateMiddleware(lanState: ILanState22) {

        const iHostState = {};

        const powerState = _.get(lanState, 'state', null);

        if (powerState !== null) {
            _.merge(iHostState, {
                power: {
                    powerState,
                },
            });
        }

        const channel0 = _.get(lanState, 'channel0', null);
        const channel1 = _.get(lanState, 'channel1', null);

        if (channel0 !== null && channel1 !== null) {
            const originBright = Math.max(Number(channel0), Number(channel1));
            let index = brightMap.findIndex((v) => Number(v) === originBright);
            index = index > -1 ? index + 1 : 11;
            const brightness = percentTranslateToHundred(index, [1, 21]);
            if (brightness) {
                _.assign(iHostState, {
                    brightness: {
                        brightness,
                    },
                });
            }

            let compare = Number(channel0) - Number(channel1);
            if (compare > 0) {
                compare = 100;
            } else if (compare === 0) {
                compare = 50;
            } else {
                compare = 0;
            }

            _.merge(iHostState, {
                'color-temperature': {
                    colorTemperature: compare,
                },
            });
        }

        const redValue = _.get(lanState, 'channel2', null);
        const greenValue = _.get(lanState, 'channel3', null);
        const blueValue = _.get(lanState, 'channel4', null);

        if (redValue !== null && greenValue !== null && blueValue !== null) {
            _.merge(iHostState, {
                'color-rgb': {
                    red: Number(redValue),
                    green: Number(greenValue),
                    blue: Number(blueValue),
                },
            });
        }

        return iHostState;
    }

    protected _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        let lanState = {};

        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(this._deviceId);
        const { devices } = initDeviceList([eWeLinkDeviceData] as any);
        const device = devices[0];

        if (!device) {
            return {};
        }

        if (_.isEmpty(iHostState)) {
            return {};
        }

        const powerStateObj = _.get(iHostState, 'power');
        const brightnessObj = _.get(iHostState, 'brightness');
        const colorTempObj = _.get(iHostState, 'color-temperature');
        const colorRgbObj = _.get(iHostState, 'color-rgb');


        let powerState;
        let brightness;
        let colorTemp;
        let hue;
        let colorMode;
        let saturation;

        if (powerStateObj) {
            powerState = powerStateObj.powerState;
            const proxy = controlDevice(device, 'toggle', { switch: powerState });
            _.assign(lanState, proxy);
        }


        if (brightnessObj) {
            brightness = brightnessObj.brightness;

            brightness = utils.percentTranslateFromHundred(brightness, [1, 21]);

            const proxy = controlDevice(device, 'setBrightness', { brightness });

            _.assign(lanState, proxy);
        }

        if (colorTempObj) {
            colorTemp = colorTempObj.colorTemperature;

            //群组可能传非0、50、100的数值，做兼容（群The group may pass value other than 0, 50, and 100 for compatibility.）
            if (colorTemp >= 0 && colorTemp <= 33) {
                colorTemp = 0;
            } else if (colorTemp > 33 && colorTemp <= 66) {
                colorTemp = 50;
            } else {
                colorTemp = 100;
            }

            const proxy = controlDevice(device, 'setColorTemperature', { colorTemp });

            _.assign(lanState, proxy);
        }

        if (colorRgbObj) {
            const arr = rgbToHsv(colorRgbObj.red, colorRgbObj.green, colorRgbObj.blue);
            hue = arr[0];
            saturation = arr[1];

            const proxy = controlDevice(device, 'setColor', { hue, saturation });

            _.assign(lanState, proxy);
        }

        // 场景处理（Scene processing）
        if (Object.keys(iHostState).length >= 2) {
            const proxy = controlDevice(device, 'setMultiLightControl', { brightness, colorTemp, hue, mode: colorMode, saturation });
            lanState = proxy;
        }

        return lanState;
    }
}
