import _ from "lodash";
import { IHostStateInterface } from "../../../../ts/interface/IHostState";
import deviceDataUtil from "../../../../utils/deviceDataUtil";
import { ILanStateFiveColorLamp } from "../../../../ts/interface/ILanState";
import curtain from './curtain'

export function fiveColorLightFormatter(iHostState: IHostStateInterface, lanState: any, deviceId: string) {
    const _iHostState = _.cloneDeep(iHostState);
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const colorMode: ILanStateFiveColorLamp['colorMode'] | null = _.get(eWeLinkDeviceData, ['itemData', 'params', 'colorMode'], null);
    const rgbBrightness = _.get(lanState, 'rgbBrightness', null) ?? _.get(eWeLinkDeviceData, ['itemData', 'params', 'rgbBrightness'], null);
    const cctBrightness = _.get(eWeLinkDeviceData, ['itemData', 'params', 'cctBrightness'], null);
    if ('cct' === colorMode && cctBrightness) {
        _.set(_iHostState, 'brightness.brightness', cctBrightness);
    }
    if ('rgb' === colorMode && rgbBrightness) {
        _.set(_iHostState, 'brightness.brightness', rgbBrightness);
    }
    return _iHostState;
}

export default {
    curtain
}
