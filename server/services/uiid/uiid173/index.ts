import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import lanStateToIHostState from "../common/lanStateToIHostState";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { ILanState173And137 } from "../../../ts/interface/ILanState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import { rgbToHsv } from "../../../utils/colorUtils";

/** 律动灯带-蓝牙版 (rhythm Light strip Bluetooth version) */
export default class Uiid extends BaseDeviceOperate {
    static uiid = EUiid.uiid_173;

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
            {
                capability: ECapability.MODE,
                permission: EPermission.UPDATE_UPDATED,
                name: 'lightMode',
                settings: {
                    supportedValues: {
                        type: "enum",
                        permission: "01",
                        values: ['colorTemperature', 'color', 'whiteLight']// 自定义模式值，如果配置则全部覆盖
                    },
                },
            },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState173And137) {
        const iHostState = {}
        _.assign(iHostState, lanStateToIHostState.uiid173And137(lanState))
        return iHostState
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
        const modeObj = _.get(iHostState, 'mode');


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
            colorTemp = 100 - colorTemp;
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

        if (modeObj) {
            const modeMapObj: any = {
                colorTemperature: 'cct',
                color: 'rgb',
                whiteLight: 'white',
            };
            const modeValue = _.get(modeObj, ['lightMode', 'modeValue']);
            colorMode = modeMapObj[modeValue];
            const proxy = controlDevice(device, 'setLightMode', { colorMode });
            _.assign(lanState, proxy);
        }

        if (Object.keys(iHostState).length === 2 && brightnessObj && modeObj) {
            const proxy = controlDevice(device, 'setBrightness', { brightness: brightnessObj.brightness, mode: colorMode });

            _.assign(lanState, proxy);
            return lanState;
        }

        if (Object.keys(iHostState).length >= 2) {
            const proxy = controlDevice(device, 'setMultiLightControl', { brightness, colorTemp, hue, mode: colorMode, saturation });
            lanState = proxy;
        }

        return lanState;
    }
}