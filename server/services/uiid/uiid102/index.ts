import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import { toIntNumber } from "../../../utils/tool";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanState102 } from "../../../ts/interface/ILanState";
import logger from "../../../log";
import { changeVoltageToBattery } from "../../../utils/deviceTool";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import deviceDataUtil from "../../../utils/deviceDataUtil";

/** WiFi门磁(Wi fi gate) */
export default class Uiid102 extends BaseDeviceOperate {

    static uiid = EUiid.uiid_102;

    protected _controlMode = EDeviceControlMode.WAN;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.CONTACT_SENSOR,
        capabilities: [
            { capability: ECapability.CONTACT, permission: EPermission.UPDATED },
            { capability: ECapability.BATTERY, permission: EPermission.UPDATED },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState102) {
        const iHostState = {};

        const switchState = _.get(lanState, 'switch', null);

        if (switchState !== null) {
            _.merge(iHostState, {
                contact: {
                    contact: switchState === 'on',
                },
            });
        }

        const battery = _.get(lanState, 'battery', null);

        if (battery !== null) {
            const eWelinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(this._deviceId);

            const batteryPercentage = changeVoltageToBattery(battery, eWelinkDeviceData)
            logger.info('battery voltage:', battery, 'batteryPercentage:', batteryPercentage, this._deviceId)
            _.merge(iHostState, {
                battery: {
                    battery: toIntNumber(batteryPercentage),
                },
            });
        }
        return iHostState;
    }

}