import IEWeLinkDevice from "../../../../ts/interface/IEWeLinkDevice";
import { ILanState126And165 } from "../../../../ts/interface/ILanState";
import ECategory from "../../../../ts/enum/ECategory";
import ECapability from "../../../../ts/enum/ECapability";
import EPermission from "../../../../ts/enum/EPermission";
import _ from "lodash";

const defaultCapabilities = [
    {
        display_category: '',
        capabilities: [],
    },
    {
        display_category: ECategory.SWITCH,
        capabilities: [
            { capability: ECapability.POWER, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
        ],
    },
    {
        display_category: ECategory.CURTAIN,
        capabilities: [
            {
                capability: ECapability.MOTOR_CLB,
                permission: EPermission.UPDATED,
            },
            { capability: ECapability.MOTOR_CONTROL, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.PERCENTAGE, permission: EPermission.UPDATE_UPDATED },
            { capability: ECapability.RSSI, permission: EPermission.UPDATED },
        ],
    }
]

/** 126 和 165 通过易位联数据和局域网数据获取设备的能力协议配置和设备类别 */
export default function getCategoryAndCapabilitiesBy126And165(lanState: ILanState126And165, eWeLinkDeviceData: IEWeLinkDevice) {
    const lanWorkMode = _.get(lanState, 'workMode', null);
    const eWeLinkWorkMode = _.get(eWeLinkDeviceData, ['itemData', 'params', 'workMode'], null);
    const workMode = lanWorkMode ?? eWeLinkWorkMode;
    //电表模式不支持 (Meter mode is not supported)
    if (workMode === null || workMode === 3) {
        return { display_category: '', capabilities: [] };
    }
    const capObj = defaultCapabilities[workMode];
    const display_category = capObj.display_category;
    const capabilities = capObj.capabilities;
    return {
        display_category,
        capabilities
    }
}