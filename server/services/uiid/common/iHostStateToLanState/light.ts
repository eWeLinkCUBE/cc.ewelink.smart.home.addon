import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import deviceDataUtil from "../../../../utils/deviceDataUtil";
import _ from "lodash";
import deviceStateUtil from "../../../../utils/deviceStateUtil";
import { ILanStateLight } from "../../../../ts/interface/ILanState";
import getSingleProtocolLanState from "./getSingleProtocolLanState";

export default function iHostStateToLanStateLight(iHostState: IHostStateInterface, deviceId: string, ct?: number) {

    const brightnessObj = _.get(iHostState, 'brightness', null);
    const colorTemperatureObj = _.get(iHostState, 'color-temperature', null);
    const colorRgbObj = _.get(iHostState, 'color-rgb', null);
    let lanState: ILanStateLight | object = {}

    if (brightnessObj || colorTemperatureObj || colorRgbObj) {
        lanState = getLanState(deviceId) as ILanStateLight
    } else {
        // 控制亮度色温颜色的时候，不带开关参数（When controlling the brightness color temperature, no switching parameters are included）
        _.assign(lanState, getSingleProtocolLanState(iHostState));
    }

    const ltype = _.get(lanState, 'ltype', 'white');
    const br = _.get(lanState, [ltype, 'br'], 0);

    if (brightnessObj) {
        const ltype = _.get(lanState, 'ltype', null);
        let newLanState: any = {};
        // 第一次拿到的局域网设备信息，没有灯模式字段
        // The LAN device information obtained for the first time does not have a light mode field.
        if (ltype === null) {
            newLanState = {
                ltype: 'white',
                white: {
                    br: brightnessObj.brightness,
                    ct: 100,
                },
            };
        } else {
            newLanState[ltype] = {
                br: brightnessObj.brightness,
            };
        }
        _.merge(lanState, newLanState);
    }

    if (colorTemperatureObj) {
        const newLanState: any = {
            ltype: 'white',
        };

        newLanState['white'] = {
            // 防止一起亮度喝色温一起控制时，亮度不生效
            // Prevent the brightness from not taking effect when the brightness and color temperature are controlled together.
            br: brightnessObj?.brightness ?? br,
            ct: ct,
        };

        _.merge(lanState, newLanState);
    }

    if (colorRgbObj) {
        const newLanState: any = {
            ltype: 'color',
        };

        newLanState['color'] = {
            br: brightnessObj?.brightness ?? br,
            r: colorRgbObj.red,
            g: colorRgbObj.green,
            b: colorRgbObj.blue,
        };
        _.merge(lanState, newLanState);
    }

    if ('ltype' in lanState) {
        lanState?.ltype === 'white' && delete lanState.color;
        lanState?.ltype === 'color' && delete lanState.white;
    }
    return lanState;
}


function getLanState(deviceId: string) {
    let lanState;
    if (deviceStateUtil.isInLanProtocol(deviceId)) {
        lanState = deviceDataUtil.getLastLanState(deviceId);
        lanState && delete lanState._subDeviceId;
    }
    else {
        const params = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId)?.itemData?.params;
        lanState = params ? _.pick(params, ['ltype', 'white', 'color']) : {};
    }
    lanState && delete lanState.switch;
    lanState && delete lanState.fwVersion;
    return lanState;
}