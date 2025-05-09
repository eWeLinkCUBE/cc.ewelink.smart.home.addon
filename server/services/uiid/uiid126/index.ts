import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import lanStateToIHostState from "../common/lanStateToIHostState";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import deviceStateUtil from "../../../utils/deviceStateUtil";
import updateLanDeviceData from "../../public/updateLanDeviceData";
import controlDeviceByLan from "../common/controlDeviceByLan";
import { Request } from "express";
import getState126And165 from "../../public/getState126And165";
import { createFailResModeError } from "../common/controlDeviceByLan/utils/createRes";
import ECapability from "../../../ts/enum/ECapability";
import logger from "../../../log";
import getReqInfo from "../common/controlDeviceByLan/utils/getReqInfo";
import categoryAndCapabilities from "../common/categoryAndCapabilities";
import { ILanState126And165 } from "../../../ts/interface/ILanState";
import ISmartHomeConfig from "../../../ts/interface/ISmartHomeConfig";

/** 多功能双通道电量检测开关 (Multifunctional dual-channel power detection switch) */
export default class Uiid126 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_126;

    protected _controlMode = EDeviceControlMode.LAN_AND_WAN;

    protected _channelProtocolType = EChannelProtocol.MULTI_PROTOCOL;

    /** 通道数 */
    protected get _toggleLength() {
        return 2;
    }

    constructor(deviceId: string) {
        super(deviceId);
    }

    protected override async _generateLanStateWhenSync() {
        return await getState126And165(this._deviceId);
    }

    protected override _getSmartHomeConfigWhenGenerateTags() {
        const _smartHomeConfig: ISmartHomeConfig = {};
        _smartHomeConfig.isShowModeTip = true;
        return _smartHomeConfig;
    }

    /** 得到能力协议配置 */
    protected override _getCategoryAndCapabilities(lanState: ILanState126And165) {
        const { display_category: category, capabilities } = categoryAndCapabilities.getCategoryAndCapabilitiesBy126And165(lanState, this._eWeLinkDeviceData!)
        return {
            category, capabilities
        }
    }

    /** 设备上报、同步设备时 iHostState 的转换方法 */
    protected override _lanStateToIHostStateMiddleware(lanState: ILanState126And165) {
        const iHostState = {}
        return _.assign(iHostState, lanStateToIHostState.uiid126And165(this._eWeLinkDeviceData, lanState, this._toggleLength))
    }

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {}
        const isWebSocket = !deviceStateUtil.isInLan(this._deviceId)
        return _.assign(lanState, iHostStateToLanState.uiid126And165(iHostState, this._deviceId, isWebSocket))
    }

    protected override async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface) {

        const { deviceId, message_id } = getReqInfo(req)

        let lanRequest = updateLanDeviceData.setSwitches

        const lanState = this._iHostStateToLanState(iHostState)


        /** --------- 模式判断（Mode judgment）---------- */
        const { workMode = null } = await getState126And165(deviceId);
        if ([null, 3].includes(workMode)) {
            return createFailResModeError(message_id);
        }

        if (_.get(iHostState, ECapability.TOGGLE)) {
            if (workMode === 2) {
                logger.info('no right mode', workMode);
                return createFailResModeError(message_id);
            }
        }

        if (_.get(iHostState, ECapability.MOTOR_CONTROL) || _.get(iHostState, ECapability.PERCENTAGE)) {
            if (workMode === 1) {
                logger.info('no right mode', workMode);
                return createFailResModeError(message_id);
            }
        }
        /** --------- 模式判断（Mode judgment）---------- */


        /** --------- 电机控制 (Motor control)---------- */
        let lanStateObj = typeof lanState === 'string' && JSON.parse(lanState)
        if (_.get(lanStateObj, 'motorTurn', null) !== null) {
            lanStateObj = _.pick(lanStateObj, ['motorTurn']);
            lanRequest = updateLanDeviceData.setCurtainMotorTurn
        }

        if (_.get(lanStateObj, 'location', null)) {
            lanStateObj = _.pick(lanStateObj, ['location']);
            lanRequest = updateLanDeviceData.setCurtainLocation
        }
        /** --------- 电机控制 (Motor control)---------- */

        return controlDeviceByLan.request(req, lanRequest, JSON.stringify(lanStateObj))
    }
}