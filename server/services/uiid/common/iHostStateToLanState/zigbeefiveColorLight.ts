import _ from "lodash";
import { controlDevice, initDeviceList } from "../../../../lib/coolkit-device-protocol";
import logger from "../../../../log";
import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import deviceDataUtil from "../../../../utils/deviceDataUtil";
import { rgbToHsv } from "../../../../utils/colorUtils";

export function zigbeeFiveColorLamp(iHostState: IHostStateInterface, deviceId: string) {
    let lanState = {};
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const { devices } = initDeviceList([eWeLinkDeviceData] as any);
    const device = devices[0];
    if (!device || _.isEmpty(iHostState)) return {};

    logger.info('zigbeeFiveColorLamp: ', iHostState);

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
        //解决zigbee五色灯设置色温时没有亮度字段问题
        //Solve the problem that there is no brightness field when setting the color temperature of the zigbee five-color lamp
        const modeProxy = controlDevice(device, 'setLightMode', { colorMode: 'cct' });
        const proxy = controlDevice(device, 'setColorTemperature', { colorTemp });
        _.assign(lanState, modeProxy, proxy);
    }

    if (colorRgbObj) {
        const arr = rgbToHsv(colorRgbObj.red, colorRgbObj.green, colorRgbObj.blue);
        hue = arr[0];
        saturation = arr[1];
        //解决zigbee五色灯设置颜色时没有亮度字段问题
        //Solve the problem that there is no brightness field when setting the color of zigbee five-color lamp
        const modeProxy = controlDevice(device, 'setLightMode', { colorMode: 'rgb' });
        const proxy = controlDevice(device, 'setColor', { hue, saturation });
        _.assign(lanState, modeProxy, proxy);
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

    logger.info('zigbeeFiveColorLamp: ', lanState);

    return lanState;
}