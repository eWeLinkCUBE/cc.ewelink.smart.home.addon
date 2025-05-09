import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import logger from "../../../log";
import getAllRemoteDeviceList from "../../../utils/getAllRemoteDeviceList";
import config from "../../../config";
import { encode } from 'js-base64';
import _ from "lodash";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import ECategory from "../../../ts/enum/ECategory";
import ECapability from "../../../ts/enum/ECapability";
import EPermission from "../../../ts/enum/EPermission";
import { v4 as uuidv4 } from 'uuid';
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import updateLanDeviceData from "../../public/updateLanDeviceData";
import { Request } from "express";
import EDeviceControlMode from "../../../ts/enum/EDeviceControlMode";
import { decode } from 'js-base64';
import { IReqData } from "../../../ts/interface/IReqData";
import { createFailRes, createSuccessRes, createFailResNoLearn } from "../common/controlDeviceByLan/utils/createRes";
import iHostDeviceMap from "../../../ts/class/iHostDeviceMap";
import { ILanState28 } from "../../../ts/interface/ILanState";
import { deleteDevice, updateDeviceInfo, syncDeviceOnlineToIHost, syncDeviceToIHost, syncDeviceStateToIHost } from "../../../api/iHost";
import getEWeLinkDevice from "../../public/getEWeLinkDevice";
import CkApi from '../../../lib/coolkit-api';
import wsService from "../../webSocket/wsService";
import deviceStateUtil from "../../../utils/deviceStateUtil";
import db from "../../../utils/db";
import controlDeviceByLan from "../common/controlDeviceByLan";

/** 
 * RFBridge
 * rf 网关子设备没有自己的 uiid，deviceId 格式比较特殊
 * The rf gateway sub-device does not have its own uiid, the device Id format is relatively special 
*/
export default class Uiid28 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_28;

    protected _controlMode: EDeviceControlMode = EDeviceControlMode.LAN_AND_WAN;

    /** 子设备云端数据 */
    private _getRemoteDeviceData(remoteIndex: number) {
        const remoteDeviceList = getAllRemoteDeviceList(this._deviceId);
        return remoteDeviceList[remoteIndex];
    }

    constructor(deviceId: string) {
        super(deviceId);
    }

    // ==============================================更新易微联侧 tags begin=============================================
    async updateEWeLinkDeviceTags(needRequest: boolean) {
        try {
            logger.info('to update device tags', this._deviceId);
            //先获取最新的tags数据(Get the latest tags data first)
            if (needRequest) {
                await getEWeLinkDevice(this._deviceId);
            }
            if (!this._eWeLinkDeviceData) {
                throw new Error('no eWeLinkDeviceData');
            }

            logger.info('updateEWeLinkRfDeviceTags------------------', this._deviceId);

            const tags = _.get(_.cloneDeep(this._eWeLinkDeviceData.itemData), ['tags']);
            const zyx_info = _.get(tags, ['zyx_info']) as { smartHomeAddonRemoteId: string; buttonName: Array<{ rfChl: string }>; remote_type: string; name: string }[];

            if (!zyx_info) {
                return;
            }
            const isLackRemoteId = zyx_info.some((item) => {
                return _.isEmpty(item?.smartHomeAddonRemoteId);
            });

            if (!isLackRemoteId) {
                logger.info('already update----');
                return true;
            }

            if (!zyx_info) {
                return;
            }

            zyx_info.forEach((item, remoteIndex) => {
                const remoteDeviceList = getAllRemoteDeviceList(this._deviceId);
                const remoteDevice = remoteDeviceList[remoteIndex];
                if (_.isEmpty(item?.smartHomeAddonRemoteId)) {
                    const third_serial_number = deviceDataUtil.getThirdSerialNumberByRfRemote(this._deviceId, remoteDevice);
                    let smartHomeAddonRemoteId;
                    if (third_serial_number) {
                        logger.info('has smartHomeAddonRemoteId-----------------------', third_serial_number, item, item.name);
                        smartHomeAddonRemoteId = third_serial_number;
                    } else {
                        logger.info('no smartHomeAddonRemoteId----------------------', item.name);
                        smartHomeAddonRemoteId = `${this._deviceId}_${uuidv4()}`;
                    }
                    _.set(tags, ['zyx_info', remoteIndex, 'smartHomeAddonRemoteId'], smartHomeAddonRemoteId);
                }
            });

            // const iHostDeviceData = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);

            logger.info('tags------------------', tags);

            const res = await CkApi.device.updateDeviceTag({
                deviceid: this._deviceId,
                tags,
            });

            logger.info('tags------------------res', res);

            if (res.error === 0) {
                deviceDataUtil.updateEWeLinkDeviceData(this._deviceId, 'device', res.data.updatedThing);
                return true;
            }
            return false;
        } catch (error: any) {
            logger.error('updateEWeLinkRfDeviceTags code error---------------------------', error);
            return null;
        }
    }
    // ==============================================更新易微联侧 tags over=============================================

    // ==============================================同步设备 begin=============================================
    protected _generateSyncIHostDeviceData(remoteIndex: number): any {
        if (!this._eWeLinkDeviceData) {
            return null;
        }
        if (!this._eWeLinkApiInfo) {
            return null;
        }

        const remoteDeviceData = this._getRemoteDeviceData(remoteIndex);

        const { uiid, model } = this._eWeLinkDeviceData.itemData.extra;
        const { brandName = '', devicekey, apikey } = this._eWeLinkDeviceData.itemData;

        const service_address = `${config.localIp}/api/v1/device/${this._deviceId}`;

        if (!remoteDeviceData) {
            return null;
        }

        const display_category = ECategory.BUTTON;

        const buttonInfoList = remoteDeviceData.buttonInfoList;

        const actions = buttonInfoList.map((aItem) => aItem.rfChl);

        const capabilitiyList = [
            {
                capability: "press",
                permission: EPermission.UPDATE_UPDATED,
                settings: { //可选
                    actions: { // 按键动作，可选。
                        type: "enum",
                        permission: "01",
                        values: actions
                    }
                }
            }
        ];

        logger.info('remoteDevice-------------------', remoteDeviceData);

        const third_serial_number = remoteDeviceData.smartHomeAddonRemoteId ?? '';

        const deviceInfo = encode(
            JSON.stringify({
                deviceId: this._deviceId,
                devicekey,
                selfApikey: apikey,
                uiid,
                account: this._eWeLinkApiInfo.userInfo.account,
                service_address,
                third_serial_number,
            })
        );
        const firmwareVersion = this._eWeLinkDeviceData.itemData?.params?.fwVersion;
        //rf网关bug，同步时要去掉state,防止ihost产生操作日志，只针对按键设备
        //Rf gateway bug, state needs to be removed during synchronization to prevent ihost from generating operation logs, only for key devices
        const syncIHostDeviceData = {
            third_serial_number,
            name: remoteDeviceData.name,
            display_category,
            capabilities: capabilitiyList,
            manufacturer: brandName,
            model,
            state: {},
            tags: {
                deviceInfo,
                version: config.nodeApp.version,
                _smartHomeConfig: {
                    rfGatewayConfig: {
                        deviceName: remoteDeviceData.name,
                        buttonInfoList,
                        type: remoteDeviceData.type,
                    },
                },
            },
            firmware_version: firmwareVersion ? firmwareVersion : '0.0',
            service_address,
        };

        return syncIHostDeviceData;
    }

    /** 同步设备方法 */
    async syncDeviceToIHost(remoteIndex: number) {
        try {
            const isOk = await this.updateEWeLinkDeviceTags(true);
            if (!isOk) {
                throw new Error('error updating device');
            }
            const syncDevice = this._generateSyncIHostDeviceData(remoteIndex);

            const endpoints: any = [syncDevice];

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
            logger.error('sync device to iHost code error-----------------------------', this._deviceId, remoteIndex, error);
            return null;
        }
    }

    // ==============================================同步设备 over=============================================

    // ==============================================控制设备begin=============================================

    protected override _iHostStateToLanStateMiddleware(iHostState: IHostStateInterface) {
        const lanState = {};
        const pressObj = _.get(iHostState, ['press']);
        if (pressObj) {
            _.assign(lanState, {
                rfChl: Number(pressObj.press),
            });
        }
        const isWebSocket = deviceStateUtil.isInWsProtocol(this._deviceId)
        if (isWebSocket) {
            _.assign(lanState, {
                cmd: 'transmit',
            });
        }
        return lanState;
    }

    /** 控制设备方法 */
    // TODO: 可以优化，目前是将父类的方法整个拿进来了，中间加了一行 uiid28 的单独逻辑
    protected override async _updateLanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const lanState = this._iHostStateToLanState(iHostState)!;
        const lanRequest = updateLanDeviceData.setRfButton;
        const reqData = req.body as IReqData;
        const { endpoint } = reqData.directive;

        try {

            const { message_id, third_serial_number } = controlDeviceByLan.utils.getReqInfo(req)

            if (this.isNotLearnedButton(third_serial_number, iHostState)) {
                return createFailResNoLearn(message_id)
            }

            const iHostDeviceData = JSON.parse(decode(endpoint.tags.deviceInfo));

            const { deviceId, devicekey, selfApikey } = iHostDeviceData;

            const resData = await lanRequest(deviceId, devicekey, selfApikey, lanState);
            if (resData?.error === 400) {
                return createFailResNoLearn(message_id);
            }

            if (resData && resData.error !== 0) {
                throw new Error(JSON.stringify(resData));
            }
            //控制失败 control failure
            if (!resData) {
                return createFailRes(message_id);
            }

            return createSuccessRes(message_id);
        } catch (error) {
            return createFailRes('');
        }
    }

    protected override async _updateWanDeviceStates(req: Request, iHostState: IHostStateInterface) {
        const { message_id, third_serial_number } = controlDeviceByLan.utils.getReqInfo(req)

        if (this.isNotLearnedButton(third_serial_number, iHostState)) {
            return createFailResNoLearn(message_id)
        }
        return super._updateWanDeviceStates(req, iHostState)
    }

    isNotLearnedButton(third_serial_number: string, iHostState: IHostStateInterface) {
        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByThirdSerialNumber(third_serial_number)
        if (!iHostDeviceData) {
            return
        }
        const { tags } = iHostDeviceData;
        const buttonInfoList = tags._smartHomeConfig.rfGatewayConfig.buttonInfoList as { rfChl: string, name: string, rfVal: string }[]
        const learnedButtonList: string[] = []
        buttonInfoList.forEach((item) => {
            if (item.rfVal) {
                learnedButtonList.push(item.rfChl)
            }
        })

        const press = iHostState.press?.press as string
        return !learnedButtonList.includes(press)
    }
    // ==============================================控制设备 over=============================================

    // ==============================================设备上报 begin=============================================

    protected override _lanStateToIHostStateMiddleware(lanState: ILanState28, actions: { values: string[] }) {
        const iHostState = {};
        const isWebSocket = deviceStateUtil.isInWsProtocol(this._deviceId)
        if (isWebSocket) {
            // {cmd: "trigger", rfTrig0: "2025-03-10T08:05:17.000Z"}
            const rfTrigEntry = Object.entries(lanState).find(([key]) => /^rfTrig\d+$/.test(key));
            if (rfTrigEntry) {
                const [rfTrigStr, _updateTime] = rfTrigEntry;
                const rfChlStr = rfTrigStr.replace("rfTrig", "");
                if (!actions.values.includes(rfChlStr)) {
                    return iHostState
                }
                // 按键触发时间和当前时间的间隔，时间太长不同步,单位秒
                // The interval between the key trigger time and the current time. If the time is too long, it will be out of sync. The unit is seconds.
                const gapTime = (Date.now() - new Date(_updateTime).getTime()) / 1000;
                if (gapTime > 5) {
                    return iHostState
                }

                _.merge(iHostState, {
                    press: {
                        press: rfChlStr,
                    }
                });
            }

            return iHostState
        }

        if (!lanState) {
            return iHostState;
        }

        const lanStateArr = Object.entries(lanState);

        const rfItemArr = lanStateArr.find((item) => item[0].indexOf('rfTrig') > -1); // [ 'rfTrig0','2023-05-18T06:08:30.000Z']

        if (!rfItemArr) {
            return iHostState;
        }
        let rfChl = rfItemArr[0].split('rfTrig')[1];
        const _updateTime = rfItemArr[1];
        rfChl = `${rfChl}`;
        // 该按键不属于该遥控器（This button does not belong to the remote control）
        if (!actions.values.includes(rfChl)) {
            return iHostState;
        }

        _.merge(iHostState, {
            press: {
                press: rfChl,
            },
            //加入updateTime标识，解决一个问题，防止推送多次设备状态，记得每次推送时删除掉这个updateTime
            //Add the update time identifier to solve a problem and prevent the device status from being pushed multiple times. Remember to delete this update time each time you push it.
            _updateTime,
        });

        return iHostState;
    }

    override syncDeviceStateToIHostByLan(): void {
        const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(this._deviceId);

        if (!iHostDeviceDataList) {
            return;
        }

        if (wsService.isWsConnected()) {
            return;
        }

        iHostDeviceDataList.forEach((item) => {
            const pressCap = item.capabilities.find((it) => it.capability === ECapability.PRESS);
            if (!pressCap) return;
            const actions = pressCap.settings?.actions;

            if (!actions) return;

            const oldState = iHostDeviceMap.deviceMap.get(item.third_serial_number)?.state;
            const lanState = deviceDataUtil.getLastLanState(this._deviceId);
            const newState = this._lanStateToIHostState(lanState, actions);

            let state = _.cloneDeep(newState);
            if (!state || _.isEmpty(state)) {
                return;
            }

            //屏蔽短时间内相同设备状态的上报
            // Block reports of the same device status within a short period of time
            if (JSON.stringify(newState) === JSON.stringify(oldState)) {
                return;
            }

            if (!item.capabilityList.includes('rssi')) {
                state = _.omit(state, ['rssi']);
            }
            const _updateTime = _.get(state, '_updateTime', null);

            // 按键触发时间和当前时间的间隔，时间太长不同步,单位秒
            // The interval between the key trigger time and the current time. If the time is too long, it will be out of sync. The unit is seconds.
            const gapTime = (Date.now() - new Date(_updateTime).getTime()) / 1000;
            _updateTime && logger.info('rf_updateTime----------------------', _updateTime, gapTime);
            if (gapTime > 5 || _updateTime === null) {
                return;
            }

            //去掉无关标识 (Remove irrelevant identifiers)
            state = _.omit(state, '_updateTime');

            const params = {
                event: {
                    header: {
                        name: 'DeviceStatesChangeReport',
                        message_id: uuidv4(),
                        version: '2',
                    },
                    endpoint: {
                        serial_number: item?.serial_number,
                        third_serial_number: item.third_serial_number,
                    },
                    payload: {
                        state,
                    },
                },
            };

            iHostDeviceMap.deviceMap.set(item.third_serial_number, { updateTime: Date.now(), state: newState });
            logger.info('sync device state ----------------------', this._deviceId, state);
            syncDeviceStateToIHost(params);
        });
    }

    // ==============================================设备上报 over=============================================




    // ==============================================设备上下线 begin=============================================
    /** 同步设备上下线状态 */
    async syncDeviceOnlineToIHost(isOnline: boolean) {
        try {
            //网关下子设备全部上下线 (All sub-devices under the gateway are online and offline)
            const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(this._deviceId);

            if (!iHostDeviceDataList) return;

            if (isOnline === false) {

                //websocket连接着且设备云端在线，不同步离线状态（The websocket is connected and the device cloud is online, but the offline state is not synchronized.）
                if (wsService.isWsConnected() && this._eWeLinkDeviceData && this._eWeLinkDeviceData.itemData.online == true) {
                    return;
                }

                if (!wsService.isWsConnected()) {
                    deviceDataUtil.updateEWeLinkDeviceData(this._deviceId, 'itemData', { online: false });
                }
            }

            const isAllOnline = iHostDeviceDataList.every((item) => item.online);

            //全在线 (Fully online)
            if (isOnline === isAllOnline) {
                return;
            }

            for (const item of iHostDeviceDataList) {
                const params = {
                    event: {
                        header: {
                            name: 'DeviceOnlineChangeReport',
                            message_id: uuidv4(),
                            version: '1',
                        },
                        endpoint: {
                            serial_number: item.serial_number,
                            third_serial_number: this._deviceId,
                        },
                        payload: {
                            online: isOnline,
                        },
                    },
                };
                logger.info('sync rf device online ----------', isOnline, item.serial_number, item.online);
                const res = await syncDeviceOnlineToIHost(params);
                if (res.header.name === 'ErrorResponse') {
                    logger.info('sync rf device online ----------res', res);
                }
            }
        } catch (error: any) {
            logger.error('sync device online or offline code error------------------------------------------------', error);
            return null;
        }
    }

    /** 设备上报发送消息：websocket */
    protected override async _sendDataWhenSyncDeviceStateToIHostByWebsocket(lanState: ILanState28) {
        // { cmd: 'trigger', rfTrig0: '2025-03-11T02:23:19.000Z' }
        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
        if (!eWeLinkApiInfo) {
            logger.info('no login no sync websocket state----');
            return;
        }

        const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(this._deviceId);

        if (!iHostDeviceDataList) {
            return;
        }

        iHostDeviceDataList.forEach((item) => {
            const pressCap = item.capabilities.find((it) => it.capability === ECapability.PRESS);
            if (!pressCap) return;
            const actions = pressCap.settings?.actions;
            if (!actions) return;
            let state = this._lanStateToIHostState(lanState, actions);
            // 不属于该设备的按键不同步（The keys that do not belong to the device are not synchronized）
            if (!state || _.isEmpty(state)) {
                return;
            }

            if (!item.capabilityList.includes('rssi')) {
                state = _.omit(state, ['rssi']);
            }

            const params = {
                event: {
                    header: {
                        name: 'DeviceStatesChangeReport',
                        message_id: uuidv4(),
                        version: '2',
                    },
                    endpoint: {
                        serial_number: item?.serial_number,
                        third_serial_number: item.third_serial_number,
                    },
                    payload: {
                        state,
                    },
                },
            };


            logger.info('sync device state ----------------------', this._deviceId, state);
            syncDeviceStateToIHost(params);
        });


    }
    // ==============================================设备上下线 over=============================================




    // ==============================================取消同步 begin=============================================
    override async cancelSyncDeviceToIHost(remoteIndex: number) {
        try {
            const serial_number = deviceDataUtil.getRfSerialNumberByDeviceIdAndIndex(this._deviceId, remoteIndex);

            logger.info('cancel to sync rf device------------------------------------------------realDeviceId', serial_number);
            if (!serial_number) {
                return null;
            }
            return await deleteDevice(serial_number);
        } catch (error: any) {
            logger.error('cancel sync device code error---------------------', this._deviceId, error);
            return null;
        }
    }

    /** 易微联删除设备时，自动取消同步 */
    override async autoCancelSyncDeviceToIHost(deviceInfo: any, serial_number: string) {
        const remoteDeviceList = getAllRemoteDeviceList(deviceInfo.deviceId);

        //每个遥控器都有id，才能去判断是否存在已被删除的遥控器（Each remote control has an ID, so we can determine whether there is a deleted remote control.）
        const isAllExistRemoteId = remoteDeviceList.every((it) => !!it?.smartHomeAddonRemoteId);
        if (!isAllExistRemoteId) {
            logger.info('isAllExistRemoteId----------------', remoteDeviceList);
            return;
        }

        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');

        if (!eWeLinkApiInfo) {
            logger.error('no login ----------------- no cancel sync', eWeLinkApiInfo);
            return;
        }

        const account = eWeLinkApiInfo.userInfo.account;

        const isExist = remoteDeviceList.some((it) => it.smartHomeAddonRemoteId == deviceInfo.third_serial_number);
        if (!isExist && deviceInfo.account === account) {
            deleteDevice;
            logger.info('auto cancel sync rf remote---------', remoteDeviceList, deviceInfo);
            await deleteDevice(serial_number);
        }
    }
    // ==============================================取消同步 over=============================================

    // ==============================================同步 tags 到 iHost begin=============================================
    /** 同步已经学习的rf按键值到iHost (Synchronize the learned rf key values to iHost)*/
    async syncTagsToIHost() {
        try {
            const lanState = deviceDataUtil.getLastLanState(this._deviceId);

            if (!lanState) {
                return;
            }

            const lanStateArr = Object.entries(lanState);

            const rfChlItemArr = lanStateArr.find((item) => item[0].indexOf('rfChl') > -1); // [ 'rfChl3', '0FE600A00190578008']

            if (!rfChlItemArr) {
                return;
            }

            const rfChl = rfChlItemArr[0].split('rfChl')[1];
            const rfVal = rfChlItemArr[1] as string;

            const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(this._deviceId);

            if (!iHostDeviceDataList) return;

            iHostDeviceDataList.forEach(async (item) => {
                /**
                * [
                    { rfChl: '0', name: '按键1', rfVal: '0FBE00AA0186578001' },
                    { rfChl: '1', name: '按键2', rfVal: '0FC800A00186578004' },
                    { rfChl: '2', name: '按键3', rfVal: '' },
                ] */
                let buttonInfoList = _.get(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList']) as {
                    rfChl: number | string;
                    rfVal: string;
                    name: string;
                }[];

                const buttonItem = buttonInfoList.find((tItem) => Number(tItem.rfChl) === Number(rfChl));

                if (!buttonItem) {
                    return;
                }
                buttonInfoList = buttonInfoList.map((bItem) => {
                    if (Number(bItem.rfChl) === Number(rfChl)) {
                        buttonItem.rfVal = rfVal;
                        bItem = buttonItem;
                    }
                    return bItem;
                });
                _.set(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList'], buttonInfoList);

                const params = {
                    tags: item.tags,
                };

                await updateDeviceInfo(item.serial_number, params);
            });
        } catch (error: any) {
            logger.error('sync device info code error--------------------------------', this._deviceId, error);
            return null;
        }
    }
    /**
      * 从云端拿到最新的rf按键学习数据后，把按键值同步到iHost
      * After getting the latest rf key learning data from the cloud, synchronize the key to iHost
    */
    syncTagsToIHostAfterRefresh() {
        try {
            const eWeLinkRemoteDeviceList = getAllRemoteDeviceList(this._deviceId);

            const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(this._deviceId);

            if (!iHostDeviceDataList) return;

            iHostDeviceDataList.forEach(async (item) => {
                /**
                * [
                    { rfChl: '0', name: '按键1', rfVal: '0FBE00AA0186578001' },
                    { rfChl: '1', name: '按键2', rfVal: '0FC800A00186578004' },
                    { rfChl: '2', name: '按键3', rfVal: '' },
                ] */
                const iHostButtonInfoList = _.get(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList'], []) as {
                    rfChl: string;
                    rfVal: string;
                    name: string;
                }[];

                eWeLinkRemoteDeviceList.forEach(async (it) => {
                    const eWeLinkButtonList = it.buttonInfoList;
                    //生成标识 Generate ID
                    const eWeLinkRfChlString = eWeLinkButtonList.map((e) => e.rfChl).join('-');
                    const iHostRfChlString = iHostButtonInfoList.map((e) => e.rfChl).join('-');
                    if (eWeLinkRfChlString !== iHostRfChlString) {
                        return;
                    }
                    const eWeLinkRfValString = eWeLinkButtonList.map((e) => e.rfVal).join('-');
                    const iHostRfValString = iHostButtonInfoList.map((e) => e.rfVal).join('-');
                    if (eWeLinkRfValString !== iHostRfValString) {
                        _.set(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList'], eWeLinkButtonList);

                        const params = {
                            tags: item.tags,
                        };

                        updateDeviceInfo(item.serial_number, params);
                    }
                });
            });
        } catch (error: any) {
            logger.error('sync device info after refresh code error--------------------------------', this._deviceId, error);
            return null;
        }
    }

    // ==============================================同步 tags 到 iHost over=============================================




}