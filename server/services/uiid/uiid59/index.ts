import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { fakeTempList } from "../../../constants/uiid59FakeTempList";
import utils from "../common/utils";
import { ILanState59 } from "../../../ts/interface/ILanState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import { rgbToHsv } from "../../../utils/colorUtils";
import deviceDataUtil from "../../../utils/deviceDataUtil";

/** 律动灯带 (Rhythm light strip) */
export default class Uiid59 extends BaseDeviceOperate {

    static uiid = EUiid.uiid_59;

    protected _controlMode = EDeviceControlMode.WAN;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;


    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT_STRIP,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_TEMPERATURE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.COLOR_RGB, permission: EPermission.UPDATE_UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState59) {
        const iHostState = {};

        const brightness = _.get(lanState, 'bright', null);

        if (brightness !== null) {
            _.merge(iHostState, {
                brightness: {
                    brightness,
                },
            });
        }

        const redValue = _.get(lanState, 'colorR', null);
        const greenValue = _.get(lanState, 'colorG', null);
        const blueValue = _.get(lanState, 'colorB', null);

        if (redValue !== null && greenValue !== null && blueValue !== null) {
            _.merge(iHostState, {
                'color-rgb': {
                    red: redValue,
                    green: greenValue,
                    blue: blueValue,
                },
            });

            let index = fakeTempList.findIndex((v) => v === `${redValue},${greenValue},${blueValue}`);
            index = index > -1 ? index : 0;
            _.merge(iHostState, {
                'color-temperature': {
                    colorTemperature: 100 - utils.percentTranslateToHundred(index, [0, 143], false),
                },
            });
        }
        return iHostState;
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
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
            const proxy = controlDevice(device, 'setBrightness', { brightness });
            _.assign(lanState, proxy);
        }

        if (colorTempObj) {
            colorTemp = colorTempObj.colorTemperature;
            colorTemp = utils.percentTranslateFromHundred(colorTemp, [0, 142]);
            colorTemp = 142 - colorTemp;
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

        if (Object.keys(iHostState).length >= 2) {
            const proxy = controlDevice(device, 'setMultiLightControl', { brightness, colorTemp, hue, mode: colorMode, saturation });
            lanState = proxy;
        }

        return lanState;
    }
}