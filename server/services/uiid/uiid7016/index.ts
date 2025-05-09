import ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { ILanStatePersonExist } from "../../../ts/interface/ILanState";
import EProductMode7016 from "../../../ts/enum/EProductMode7016";
import { getSensorState } from "../common/lanStateToIHostState/sensor";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";

/**人体存在传感器 (human presence sensor)*/
export default class Uiid7020 extends ZigbeeDeviceOperate {
    static uiid = EUiid.uiid_7016;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        [EProductMode7016.EWELINK]: {
            display_category: ECategory.MOTION_SENSOR,
            capabilities: [{ capability: ECapability.MOTION, permission: EPermission.UPDATED }],
        },
        [EProductMode7016.SONOFF]: {
            display_category: ECategory.MOTION_SENSOR,
            capabilities: [
                { capability: ECapability.MOTION, permission: EPermission.UPDATED },
                {
                    capability: ECapability.ILLUMINATION_LEVEL,
                    permission: EPermission.UPDATED,
                },
            ],
        },
    };
    protected override _getCategoryAndCapabilities() {
        const { productModel } = this._eWeLinkDeviceData!.itemData;
        const { display_category: category, capabilities } = this._defaultCategoryAndCapabilities[productModel as EProductMode7016]
        return {
            capabilities,
            category
        }
    }

    /** 设备上报、同步设备时 this._iHostState 的转换方法 */
    protected override _lanStateToIHostStateMiddleware(lanState: ILanStatePersonExist) {
        const iHostState = {};
        const HUMAN_MAP = {
            0: false,
            1: true,
        };

        const human = _.get(lanState, 'human', null);

        if (human !== null) {
            _.merge(iHostState, {
                motion: {
                    motion: HUMAN_MAP[human],
                },
            });
            _.merge(iHostState, getSensorState(this._iHostDeviceData, HUMAN_MAP[human], [ECapability.MOTION, ECapability.MOTION]))
        }

        const brState = _.get(lanState, 'brState', null);

        if (brState !== null) {
            _.merge(iHostState, {
                'illumination-level': {
                    level: brState,
                },
            });
        }
        return iHostState;
    }
}