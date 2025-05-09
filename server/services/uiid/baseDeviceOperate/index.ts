import deviceDataUtil from "../../../utils/deviceDataUtil";
import ISmartHomeConfig from "../../../ts/interface/ISmartHomeConfig";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import config from "../../../config";
import db from "../../../utils/db";
import _ from "lodash";
import logger from "../../../log";
import { v4 as uuidv4 } from 'uuid';
import { syncDeviceToIHost } from "../../../api/iHost";
import { IReqData } from "../../../ts/interface/IReqData";
import iHostDeviceMap from "../../../ts/class/iHostDeviceMap";
import { syncDeviceStateToIHost } from '../../../api/iHost';
import { Request } from 'express';
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import wsService from "../../webSocket/wsService";
import EChannelProtocol from "../../../ts/enum/EChannelProtocol";
import utils from "../common/utils";
import deviceMapUtil from "../../../utils/deviceMapUtil";
import lanStateToIHostState from "../common/lanStateToIHostState";
import iHostStateToLanState from "../common/iHostStateToLanState";
import { syncDeviceOnlineToIHost } from "../../../api/iHost";
import deviceStateUtil from "../../../utils/deviceStateUtil";
import { deleteDevice } from "../../../api/iHost";
import { encode } from 'js-base64';
import external from "./external";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import controlDeviceByLan from "../common/controlDeviceByLan";
import IResData from "../../../ts/interface/IResData";
import { skipTriggerCapsOnGetEWLDeviceList, needCollectCapabilities, lanPrioritizedCapabilities } from "../../../constants/capability";

/** 设备相关操作的公共类 (设备相关操作的公共类) */
export default class BaseDeviceOperate {
    /** 设备的 deviceId (deviceId of device) */
    protected _deviceId!: string;

    /** 设备支持的通道协议 (Channel protocol supported by the device) */
    protected _channelProtocolType: EChannelProtocol = EChannelProtocol.OTHER;

    /** 设备默认的设备类别和能力配置 (Device default device category and capability configuration) */
    protected _defaultCategoryAndCapabilities!: any

    /** 控制设备的方式 (How to control the device) */
    protected _controlMode!: EDeviceControlMode;

    /** 易微联设备云端数据 (Yiweilian device cloud data) */
    protected get _eWeLinkDeviceData() {
        return deviceDataUtil.getEWeLinkDeviceDataByDeviceId(this._deviceId)
    }

    /** 易微联登录数据 (Yiweilian login data) */
    protected get _eWeLinkApiInfo() {
        return db.getDbValue('eWeLinkApiInfo');
    }

    /** 已同步到 iHost 的 iHost 侧设备数据 (iHost side device data that has been synchronized to iHost) */
    protected get _iHostDeviceData() {
        return deviceDataUtil.getIHostDeviceDataByDeviceId(this._deviceId);
    }

    /** 控制设备时请求到服务的地址 (The address to which the device requests to be served) */
    protected get _service_address() {
        return `${config.localIp}/api/v1/device/${this._deviceId}`
    }

    constructor(deviceId: string) {
        this._deviceId = deviceId;
    }

    /** 
     * 设备上报、同步时可以复用的设备状态 => iHost 能力状态 
     * Device status that can be reused during device reporting and synchronization => iHost capability status 
    */
    protected _lanStateToIHostState(lanState: any, actions?: { values: string[] }) {
        const uiid = deviceDataUtil.getUiidByDeviceId(this._deviceId);
        if (!uiid) {
            return null;
        }

        const rssi = _.get(lanState, 'rssi');
        const iHostState: any = {};
        if (rssi) {
            _.assign(iHostState, { rssi: { rssi } });
        }

        switch (this._channelProtocolType) {
            case EChannelProtocol.SINGLE_PROTOCOL:
                _.assign(iHostState, lanStateToIHostState.getSingleProtocolIHostState(lanState));
                break;
            case EChannelProtocol.SINGLE_MULTI_PROTOCOL:
                _.assign(iHostState, lanStateToIHostState.getSingleMultiProtocolIHostState(lanState));
                break;
            case EChannelProtocol.MULTI_PROTOCOL:
                _.assign(iHostState, lanStateToIHostState.getMultiProtocolIHostState(lanState, this._toggleLength));
                break;
            default:
        }

        _.assign(iHostState, this._lanStateToIHostStateMiddleware?.(lanState, actions))

        // 去掉对象中不合法的值(Remove illegal value)
        if (iHostState) {
            Object.keys(iHostState).forEach((key) => {
                if (typeof iHostState[key] === 'object' && Object.keys(iHostState[key]).length === 0) {
                    delete iHostState[key];
                }
            });
        }

        return iHostState;
    }

    protected _lanStateToIHostStateMiddleware?(lanState: any, actions?: { values: string[] }): any;



    // ================================== 同步设备相关逻辑 begin (Synchronize device related logic begin) ====================================

    /** 多通道设备的通道数 (Number of channels for multi-channel devices) */
    protected get _toggleLength() {
        if (!this._defaultCategoryAndCapabilities) {
            return 1;
        }

        let toggleLength = 0;
        this._defaultCategoryAndCapabilities.capabilities.forEach((item: any) => {
            if (item.capability === ECapability.TOGGLE) {
                toggleLength++;
            }
        });

        return toggleLength;
    }

    /** 
     * 得到设备类别和设备能力协议配置，默认取默认配置
     * Get the device category and device capability protocol configuration, and get the default configuration by default 
    */
    protected _getCategoryAndCapabilities(lanState: any) {
        return this._defaultCategoryAndCapabilities;
    }

    /** 
     * 生成要同步设备的 tags.toggle: 仅多通道设备需要此字段 
     * Generate tags.toggle for the device to be synchronized: This field is required for multi-channel devices only
    */
    private _getToggleWhenGenerateTags() {
        if (this._channelProtocolType !== EChannelProtocol.MULTI_PROTOCOL) return;
        let toggle;
        const toggleNameObj = _.get(this._eWeLinkDeviceData!.itemData.tags, 'ck_channel_name', null);
        if (toggleNameObj) {
            toggle = utils.incrementKeys(toggleNameObj);
        }

        return toggle;
    }

    protected _getTemperatureUnitWhenGenerateTags?(): string | undefined;

    protected _getSmartHomeConfigWhenGenerateTags() {
        const _smartHomeConfig: ISmartHomeConfig = {};
        return _smartHomeConfig;
    }

    protected async _generateLanStateWhenSync() {
        let lanState;
        if (this._controlMode === EDeviceControlMode.LAN) {
            lanState = deviceDataUtil.getLastLanState(this._deviceId);
        }
        if (this._controlMode === EDeviceControlMode.WAN) {
            lanState = this._eWeLinkDeviceData!.itemData.params;
        }
        const mDnsDeviceData = deviceMapUtil.getMDnsDeviceDataByDeviceId(this._deviceId);
        /** 优先局域网 */
        if (mDnsDeviceData) {
            lanState = deviceDataUtil.getLastLanState(this._deviceId);
        } else {
            lanState = this._eWeLinkDeviceData!.itemData.params;
        }
        return Promise.resolve(lanState);
    }

    /** 同步时生成完整的 iHostState (Generate a complete iHostState when synchronized) */
    protected async _generateIHostStateWhenSync(lanState: any) {
        return Promise.resolve(this._lanStateToIHostState(lanState));
    }

    /** 生成 iHost tags (Generate iHost tags) */
    private async _generateIHostTags() {
        const deviceInfo = await this._getDeviceInfoWhenGenerateTags();
        const toggle = this._getToggleWhenGenerateTags();
        const temperatureUnit = this._getTemperatureUnitWhenGenerateTags?.();
        const smartHomeConfig = this._getSmartHomeConfigWhenGenerateTags();
        return {
            deviceInfo: encode(JSON.stringify(deviceInfo)),
            version: config.nodeApp.version,
            _smartHomeConfig: smartHomeConfig,
            toggle,
            temperature_unit: temperatureUnit,
        }
    }

    /** 获取设备能力配置 (Obtain device capability configuration) */
    protected _generateCategoryAndCapabilities(lanState: any, iHostState: any) {
        const categoryAndCapabilities = this._getCategoryAndCapabilities(lanState);
        const { category } = categoryAndCapabilities;
        let { capabilities } = categoryAndCapabilities;
        if (_.get(iHostState, 'rssi')) {
            capabilities.push({
                capability: ECapability.RSSI,
                permission: EPermission.UPDATED,
            });
        }

        if (_.get(this._eWeLinkDeviceData, 'itemData.params.battery', null) !== null) {
            capabilities.push({
                capability: ECapability.BATTERY,
                permission: EPermission.UPDATED,
            });
        }

        capabilities = _.uniqWith(capabilities, _.isEqual);
        return { category, capabilities }
    }

    /** 生成要同步的 tags 中的deviceInfo (Generate deviceInfo in tags to be synchronized) */
    protected async _getDeviceInfoWhenGenerateTags() {
        const { uiid } = this._eWeLinkDeviceData!.itemData.extra;
        const { devicekey, apikey } = this._eWeLinkDeviceData!.itemData;

        return Promise.resolve({
            deviceId: this._deviceId,
            devicekey,
            selfApikey: apikey,
            uiid,
            account: this._eWeLinkApiInfo!.userInfo.account,
            service_address: this._service_address,
        });
    }

    /** 初始化易微联数据 (Initialize Yiweilian data) */
    protected _getEWeLinkDevice?(): Promise<void>

    /** 生成同步设备数据的方法 (Methods to generate synchronous device data) */
    protected async _generateSyncIHostDeviceData(remoteIndex?: number) {
        try {
            if (!this._eWeLinkDeviceData) {
                return null;
            }

            if (!this._eWeLinkApiInfo) {
                return null;
            }

            await this._getEWeLinkDevice?.();
            const lanState = await this._generateLanStateWhenSync();
            const iHostState = await this._generateIHostStateWhenSync(lanState); // 获取到了 iHostState
            if (!iHostState) return null;
            const { category, capabilities } = this._generateCategoryAndCapabilities(lanState, iHostState); // 获取到了设备类别和能力协议配置
            const tags = await this._generateIHostTags(); // 获取到了设备的 tags
            const firmwareVersion = this._eWeLinkDeviceData.itemData?.params?.fwVersion;
            if (category === '' || capabilities?.length === 0) return null;
            const { brandName = '', productModel } = this._eWeLinkDeviceData.itemData;
            return {
                third_serial_number: this._deviceId,
                name: this._eWeLinkDeviceData.itemData.name,
                display_category: category,
                capabilities,
                state: iHostState,
                manufacturer: brandName,
                model: productModel,
                tags,
                firmware_version: firmwareVersion ? firmwareVersion : '0.0',
                service_address: this._service_address,
            };
        } catch (error) {
            logger.error('generateSyncIHostDeviceData fail------------------------------------------------', JSON.stringify(error))
            return null;
        }

    }

    /** 同步设备方法 (Synchronize device method) */
    async syncDeviceToIHost(remoteIndex?: number) {
        try {
            const endpoints: any = [];
            const endpointObj = await this._generateSyncIHostDeviceData();
            if (endpointObj) {
                endpoints.push(endpointObj);
            }

            if (endpoints.length === 0) {
                return null;
            }

            const params = {
                event: {
                    header: {
                        name: 'DiscoveryRequest',
                        message_id: uuidv4(),
                        version: '2',
                    },
                    payload: {
                        endpoints,
                    },
                },
            };
            logger.info('sync device to iHost params====================================', JSON.stringify(params, null, 2));
            const res = await syncDeviceToIHost(params);
            return res;
        } catch (error: any) {
            logger.error('sync device to iHost code error-----------------------------', this._deviceId, error);
            return null;
        }
    }

    // ================================== 同步设备相关逻辑 over (Synchronize device-related logic over) ====================================








    // ================================== 设备控制相关逻辑 begin (Device control related logic begin) ====================================

    /** 是否需要收集参数 (Is it necessary to collect parameters) */
    private _isNeedCollect(iHostState: IHostStateInterface) {
        return needCollectCapabilities.some((ability) => _.get(iHostState, [ability]));
    }

    /** 设备控制时，iHost 能力状态 => 设备状态 (iHost capability status => Device status during device control) */
    protected _iHostStateToLanState(iHostState: any) {
        const uiid = deviceDataUtil.getUiidByDeviceId(this._deviceId);
        if (!uiid) {
            return null;
        }

        const lanState: any = {};

        switch (this._channelProtocolType) {
            case EChannelProtocol.SINGLE_PROTOCOL:
                _.assign(lanState, iHostStateToLanState.getSingleProtocolLanState(iHostState));
                break;
            case EChannelProtocol.SINGLE_MULTI_PROTOCOL:
                _.assign(lanState, iHostStateToLanState.getSingleMultiProtocolLanState(iHostState));
                break;
            case EChannelProtocol.MULTI_PROTOCOL:
                _.assign(lanState, iHostStateToLanState.getMultiProtocolLanState(iHostState));
                break;
            default:
        }

        _.assign(lanState, this._iHostStateToLanStateMiddleware?.(iHostState));

        return JSON.stringify(lanState);
    }

    protected _iHostStateToLanStateMiddleware?(iHostState: any): any;

    /** 
     * 查询设备历史数据,如果设备同时支持lan和wan，优先局域网控制
     * Query the device's historical data. If the device supports both lan and wan, priority will be given to LAN control.
    */
    async queryDeviceStates(req: Request) {
        if (this._controlMode === EDeviceControlMode.LAN) {
            return await this._queryLanDeviceStates(req)
        } else if (this._controlMode === EDeviceControlMode.WAN) {
            return await this._queryWanDeviceStates(req)
        }

        if (deviceStateUtil.isInLan(this._deviceId)) {
            return await this._queryLanDeviceStates(req)
        } else {
            return await this._queryWanDeviceStates(req)
        }
    }
    /** 查询 lan 设备历史数据 (Query lan device history data) */
    protected async _queryLanDeviceStates(req: Request): Promise<any> {
        return await external.queryLanDeviceStates(req);
    }
    /** 查询 wan 设备历史数据 (Query wan device history data) */
    protected async _queryWanDeviceStates(req: Request): Promise<IResData | null> {
        return null
    }

    /** 控制设备,优先局域网控制 (Control equipment, priority LAN control) */
    async updateDeviceStates(req: Request) {
        const reqData = req.body as IReqData;
        const { payload } = reqData.directive;
        const iHostState = payload.state;

        if (this._controlMode === EDeviceControlMode.LAN) {
            return await this._updateLanDeviceStatesCollect(req, iHostState)
        } else if (this._controlMode === EDeviceControlMode.WAN) {
            return await this._updateWanDeviceStates(req, iHostState)
        }

        if (deviceStateUtil.isInLan(this._deviceId)) {
            return await this._updateLanDeviceStatesCollect(req, iHostState)
        } else {
            return await this._updateWanDeviceStates(req, iHostState)
        }
    }
    protected async _updateLanDeviceStatesCollect(req: Request, iHostState: IHostStateInterface) {
        if (this._isNeedCollect(iHostState)) {
            return await controlDeviceByLan.utils.toCollectControl(
                req,
                async (req: Request, iHostState: IHostStateInterface) => await this._updateLanDeviceStates(req, iHostState)
            );
        }
        return await this._updateLanDeviceStates(req, iHostState);
    }
    /** 控制 lan 设备 (Control lan equipment) */
    protected async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface): Promise<IResData | null> {
        const lanState = this._iHostStateToLanState(iHostState);
        return await external.updateLanDeviceStates(req, this._channelProtocolType, iHostState, lanState)
    }

    /** 控制 wan 设备 (Control wan equipment) */
    protected async _updateWanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const lanState = this._iHostStateToLanState(iHostState);
        return await external.updateWanDeviceStates(req, lanState)
    }
    // ================================== 设备控制相关逻辑 over (Device control related logic over) ====================================










    // ================================== 设备状态上报相关逻辑 begin (Device status reporting related logic begin) =================================

    /** 
     * 既支持长连接和局域网的设备是否需要阻止长连接上报 
     * Whether devices that support both long connections and LANs need to block long connection reporting
     */
    private _isNeedBlockWanUpdate(iHostState: IHostStateInterface) {
        return lanPrioritizedCapabilities.some((ability) => _.get(iHostState, [ability]));
    }

    /** 设备上报发送消息：websocket (设备上报发送消息：websocket) */
    protected async _sendDataWhenSyncDeviceStateToIHostByWebsocket({ lanState, isVerifyReportCapability = false }: { lanState: any, isVerifyReportCapability?: boolean }) {
        if (!this._iHostDeviceData) {
            return;
        }

        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
        if (!eWeLinkApiInfo) {
            logger.info('no login no sync websocket state----');
            return;
        }

        let iHostState = this._lanStateToIHostState(lanState);

        if (!this._iHostDeviceData.capabilityList.includes('rssi')) {
            iHostState = _.omit(iHostState, ['rssi']);
        }

        if (isVerifyReportCapability) {
            iHostState = _.omit(iHostState, skipTriggerCapsOnGetEWLDeviceList)
        }

        if (_.isEmpty(iHostState)) {
            return;
        }

        if (this._isNeedBlockWanUpdate(iHostState) && deviceStateUtil.isInLan(this._deviceId)) {
            return;
        }

        logger.info('sync websocket device state------', JSON.stringify(iHostState, null, 2));
        
        const syncDeviceStateToIHostParams = {
            event: {
                header: {
                    name: 'DeviceStatesChangeReport',
                    message_id: uuidv4(),
                    version: '2',
                },
                endpoint: {
                    serial_number: this._iHostDeviceData.serial_number,
                    third_serial_number: this._deviceId,
                },
                payload: {
                    state: iHostState,
                },
            },
        };

        const res = await syncDeviceStateToIHost(syncDeviceStateToIHostParams);

        if (res && res.header && res.header.name === 'ErrorResponse') {
            logger.info('sync websocket device state to iHost error------------', res);
            return;
        }
        //同步设备状态同时也把设备上线了
        //Synchronize the device status and also bring the device online
        deviceDataUtil.updateIHostDeviceDataOnline(this._iHostDeviceData.serial_number, true);
    }

    /** 设备上报：局域网 (Equipment reporting: LAN) */
    syncDeviceStateToIHostByLan(): void | undefined | null {
        const lanState = deviceDataUtil.getLastLanState(this._deviceId);
        if (!this._iHostDeviceData) {
            return;
        }
        let iHostState = this._lanStateToIHostState(lanState);

        if (!iHostState) {
            return;
        }

        if (this._controlMode === EDeviceControlMode.LAN_AND_WAN) {
            if (wsService.isWsConnected() && !this._isNeedBlockWanUpdate(iHostState)) {
                return;
            }
        }

        const oldState = iHostDeviceMap.deviceMap.get(this._deviceId)?.state;

        //屏蔽短时间内相同设备状态的上报 (Block reports of the same device status within a short period of time)
        if (JSON.stringify(iHostState) === JSON.stringify(oldState)) {
            return;
        }

        if (!this._iHostDeviceData.capabilityList.includes('rssi')) {
            iHostState = _.omit(iHostState, ['rssi']);
        }
        const params = {
            event: {
                header: {
                    name: 'DeviceStatesChangeReport',
                    message_id: uuidv4(),
                    version: '2',
                },
                endpoint: {
                    serial_number: this._iHostDeviceData.serial_number,
                    third_serial_number: this._deviceId,
                },
                payload: {
                    state: iHostState,
                },
            },
        };

        logger.info('sync device status-----', this._iHostDeviceData.deviceId, JSON.stringify(iHostState));

        const nowTime = Date.now();

        iHostDeviceMap.deviceMap.set(this._deviceId, { updateTime: nowTime, state: iHostState });

        syncDeviceStateToIHost(params);
    }

    /** 设备上报：websocket (Device Report: websocket) */
    async syncDeviceStateToIHostByWebsocket(data: { lanState: any, isVerifyReportCapability?: boolean }) {
        await this._sendDataWhenSyncDeviceStateToIHostByWebsocket(data);
    }

    // ================================== 设备状态上报相关逻辑 over (Device status reporting logic over) =================================









    // ================================== 设备上下线相关逻辑 begin (Related logic for equipment up and down line begin) ==================================

    /** 同步设备上下线状态 (Synchronize the device's up and down status) */
    async syncDeviceOnlineToIHost(isOnline: boolean) {
        try {
            //这个设备未同步 (This device is not synced)
            if (!this._iHostDeviceData) {
                return;
            }

            if (isOnline === false && this._controlMode === EDeviceControlMode.LAN_AND_WAN) {

                //websocket连接着且设备云端在线，不同步离线状态（The websocket is connected and the device cloud is online, but the offline state is not synchronized.）
                if (wsService.isWsConnected() && this._eWeLinkDeviceData && this._eWeLinkDeviceData.itemData.online == true) {
                    return;
                }

                if (!wsService.isWsConnected()) {
                    deviceDataUtil.updateEWeLinkDeviceData(this._deviceId, 'itemData', { online: false });
                }
            }

            //在线状态相同不更新状态 (If the online status is the same, the status will not be updated.)
            if (this._iHostDeviceData.isOnline === isOnline) {
                return;
            }

            // logger.info('uiid--------------', this._deviceId);

            const params = {
                event: {
                    header: {
                        name: 'DeviceOnlineChangeReport',
                        message_id: uuidv4(),
                        version: '2',
                    },
                    endpoint: {
                        serial_number: this._iHostDeviceData.serial_number,
                        third_serial_number: this._deviceId,
                    },
                    payload: {
                        online: isOnline,
                    },
                },
            };

            logger.info('sync device online or offline------', this._deviceId, isOnline);
            const res = await syncDeviceOnlineToIHost(params);

            if (res?.header?.name === 'Response') {
                deviceDataUtil.updateIHostDeviceDataOnline(this._iHostDeviceData.serial_number, isOnline);
            }

            return res;
        } catch (error: any) {
            logger.error('sync device online or offline code error------------------------------------------------', error);
            return null;
        }
    }

    /** 将 websocket 设备离线 (Take the websocket device offline) */
    async syncWebsocketDeviceOffline() {
        if (this._controlMode === EDeviceControlMode.WAN) {
            await this.syncDeviceOnlineToIHost(false);
        }

        if (this._controlMode === EDeviceControlMode.LAN_AND_WAN) {
            const isInLan = deviceStateUtil.isInLan(this._deviceId);

            if (!isInLan) {
                await this.syncDeviceOnlineToIHost(false);
            }
        }
    }

    // ================================== 设备上下线相关逻辑 over (Related logic for equipment up and down line over) ==================================










    // ================================== 取消同步相关逻辑 begin (Cancel synchronization related logic begin) ==================================

    async cancelSyncDeviceToIHost(remoteIndex?: number) {
        try {
            if (!this._iHostDeviceData) {
                logger.error('to cancel sync device can not find this device-----------------', this._iHostDeviceData);
                return null;
            }

            logger.info('cancel to sync device------------------------------------------------realDeviceId', this._iHostDeviceData.serial_number);
            const res = await deleteDevice(this._iHostDeviceData.serial_number);

            return res;
        } catch (error: any) {
            logger.error('cancel sync device code error---------------------', this._deviceId, error);
            return null;
        }
    }

    async autoCancelSyncDeviceToIHost(deviceInfo: any, serial_number?: string) {
        const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
        const eWeLinkDeviceIdList = eWeLinkDeviceList.map((item) => item.itemData.deviceid);
        const account = this._eWeLinkApiInfo!.userInfo.account;

        // 当前账号下不存在该设备（该设备已被删除）
        // Does not exist under the current account（The device has been deleted）
        if (deviceInfo.account === account && !eWeLinkDeviceIdList.includes(this._deviceId)) {
            logger.info('account has this device ========', eWeLinkDeviceIdList.includes(this._deviceId), account);
            logger.info('auto cancel sync device to iHost------------', this._deviceId);
            await this.cancelSyncDeviceToIHost();
        }
    }

    // ================================== 取消同步相关逻辑 over (Cancel synchronization related logic over) ==================================
} 