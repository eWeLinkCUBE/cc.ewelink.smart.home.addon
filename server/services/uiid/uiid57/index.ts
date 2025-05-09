import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import utils from "../common/utils";
import { ILanState57 } from "../../../ts/interface/ILanState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { controlDevice, initDeviceList } from "../../../lib/coolkit-device-protocol/lib";
import deviceDataUtil from "../../../utils/deviceDataUtil";

/** 单色球泡灯 (Monochrome ball bulb lamp) */
export default class Uiid57 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_57;

    protected _controlMode = EDeviceControlMode.WAN;

    protected _channelProtocolType = EChannelProtocol.OTHER;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.LIGHT,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            {
                capability: ECapability.BRIGHTNESS,
                permission: EPermission.UPDATE_UPDATED,
            },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState57) {
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

        if (channel0 !== null) {
            _.merge(iHostState, {
                brightness: {
                    brightness: utils.percentTranslateToHundred(Number(channel0), [25, 255]),
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