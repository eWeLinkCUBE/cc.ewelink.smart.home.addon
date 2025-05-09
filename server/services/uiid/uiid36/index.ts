import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import utils from "../common/utils";
import { ILanState36 } from "../../../ts/interface/ILanState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import { IHostStateInterface } from "../../../ts/interface/IHostState";

/** 单路调光开关(single dimmer switch) */
export default class Uiid36 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_36;

    protected _controlMode = EDeviceControlMode.WAN;

    protected _channelProtocolType = EChannelProtocol.SINGLE_PROTOCOL;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.BRIGHTNESS, permission: EPermission.UPDATE_UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState36) {
        const iHostState = {};

        const brightness = _.get(lanState, 'bright', null);

        if (brightness !== null) {
            // 将10-100的值转换成1-100 Convert the value of 10 100 to 1 100
            const brightValue = utils.percentTranslateToHundred(brightness, [10, 100]);
            _.merge(iHostState, {
                brightness: {
                    brightness: brightValue,
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


        let powerState;
        let brightness;

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

        if (Object.keys(iHostState).length >= 2) {
            const proxy = controlDevice(device, 'setMultiLightControl', { brightness });
            lanState = proxy;
        }

        return lanState;
    }
}