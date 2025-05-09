import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { ILanState34 } from "../../../ts/interface/ILanState";
import getReqInfo from "../common/controlDeviceByLan/utils/getReqInfo";
import { Request } from "express";
import updateLanDeviceData from "../../public/updateLanDeviceData";
import controlDeviceByLan from "../common/controlDeviceByLan";

/** iFan03智能风扇灯 (I fan03 smart fan light)*/
export default class Uiid34 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_34;

    protected _controlMode = EDeviceControlMode.LAN;

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected _defaultCategoryAndCapabilities = {
        category: ECategory.FAN_LIGHT,
        capabilities: [
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '1' },
            { capability: ECapability.TOGGLE, permission: EPermission.UPDATE_UPDATED, name: '2' },
            {
                capability: ECapability.MODE,
                permission: EPermission.UPDATE_UPDATED,
                name: 'fanLevel',
                settings: {
                    supportedValues: {
                        type: "enum",
                        permission: "01",
                        values: ["low", "medium", "high"], // 自定义模式值，如果配置则全部覆盖
                    },
                }
            },
        ],
    }

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState34) {
        const iHostState = {}

        //去除toggle (Remove toggle)
        const light = _.get(lanState, 'light', null);

        if (light !== null) {
            _.merge(iHostState, {
                toggle: {
                    1: { toggleState: light },
                },
            });
        }

        const fan = _.get(lanState, 'fan', null);
        if (fan !== null) {
            _.merge(iHostState, {
                toggle: {
                    2: { toggleState: fan },
                },
            });
        }

        const speed = _.get(lanState, 'speed', null);
        const speedList = ['low', 'medium', 'high'];
        if (speed !== null) {
            _.merge(iHostState, {
                mode: {
                    fanLevel: {
                        modeValue: speedList[speed - 1],
                    },
                },
            });
        }
        return iHostState
    }


    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {};

        const toggleState1 = _.get(iHostState, ['toggle', '1', 'toggleState']);
        const toggleState2 = _.get(iHostState, ['toggle', '2', 'toggleState']);

        if (toggleState1) {
            _.assign(lanState, {
                light: toggleState1,
            });
        }

        if (toggleState2) {
            _.assign(lanState, {
                fan: toggleState2,
            });
        }

        const mode = _.get(iHostState, ['mode', 'fanLevel', 'modeValue'], null);
        if (mode) {
            const speedObj = {
                low: 1,
                medium: 2,
                high: 3,
            };
            _.assign(lanState, {
                speed: speedObj[mode as 'low' | 'medium' | 'high'],
                fan: 'on',
            });
        }

        return lanState;
    }

    protected override async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface) {

        const { deviceId, message_id } = getReqInfo(req)

        let lanRequest = updateLanDeviceData.setSwitches

        let lanState = this._iHostStateToLanState(iHostState)


        if (typeof lanState === 'object') {
            return null
        }

        const lanStateObj = JSON.parse(lanState);
        const isLightControl = _.get(lanStateObj, ['light'], null)
        const isFanControl = _.get(lanStateObj, 'fan', null) || _.get(lanStateObj, 'speed', null)
        const isSceneControl = isLightControl && isFanControl

        // 场景灯和风扇档位一起控制，需要把两个请求分开发送
        if (isSceneControl) {

            if (isLightControl) {
                const lightLanState = _.pick(lanStateObj, ['light']);
                lanState = JSON.stringify(lightLanState)
                lanRequest = updateLanDeviceData.setLight
            }
            controlDeviceByLan.request(req, lanRequest, lanState)

            await controlDeviceByLan.utils.sleepMs(1000)

            if (isFanControl) {
                const fanLanState = _.pick(lanStateObj, ['fan', 'speed']);
                lanState = JSON.stringify(fanLanState)
                lanRequest = updateLanDeviceData.setFan
            }
            return controlDeviceByLan.request(req, lanRequest, lanState)
        }

        // 手动灯控制
        if (isLightControl) {
            const lightLanState = _.pick(lanStateObj, ['light']);
            lanState = JSON.stringify(lightLanState)
            lanRequest = updateLanDeviceData.setLight
        }

        // 手动风扇和档位控制
        if (isFanControl) {
            const fanLanState = _.pick(lanStateObj, ['fan', 'speed']);
            lanState = JSON.stringify(fanLanState)
            lanRequest = updateLanDeviceData.setFan
        }
        return controlDeviceByLan.request(req, lanRequest, lanState)
    }
}