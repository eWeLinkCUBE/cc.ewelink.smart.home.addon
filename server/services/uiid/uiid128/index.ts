import { syncDeviceOnlineToIHost } from "../../../api/iHost";
import logger from "../../../log";
import EUiid from "../../../ts/enum/EUiid";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import wsService from "../../webSocket/wsService";
import BaseDeviceOperate from "../baseDeviceOperate";
import { v4 as uuidv4 } from 'uuid';
import { sendDeviceState, isNeedWait } from './syncState'
const DELAY_TIME = 5000;
const deviceParamsTimerObj: any = {};
const tempParams: any = {};

/** 堆叠式网关 (Stacked gateway) */
export default class Uiid extends BaseDeviceOperate {
    static uiid = EUiid.uiid_128;


    constructor(deviceId: string) {
        super(deviceId);
    }


    /** 同步设备上下线状态 */
    override  async syncDeviceOnlineToIHost(isOnline: boolean) {
        try {

            const lanState = deviceDataUtil.getLastLanState(this._deviceId)

            const _subDeviceId = lanState?._subDeviceId

            if (!_subDeviceId) {
                logger.info('not subDeviceId----')
                return
            }
            //这个设备未同步 (This device is not synced)
            if (!this._iHostDeviceData) {
                return;
            }

            if (isOnline === false) {

                const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(_subDeviceId);
                //websocket连接着且设备云端在线，不同步离线状态（The websocket is connected and the device cloud is online, but the offline state is not synchronized.）
                if (wsService.isWsConnected() && eWeLinkDeviceData && eWeLinkDeviceData.itemData?.online == true) {
                    return;
                }

                if (!wsService.isWsConnected()) {
                    deviceDataUtil.updateEWeLinkDeviceData(_subDeviceId, 'itemData', { online: false });
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
                        third_serial_number: _subDeviceId,
                    },
                    payload: {
                        online: isOnline,
                    },
                },
            };

            logger.info('sync device online or offline------', this._deviceId, isOnline);
            const res = await syncDeviceOnlineToIHost(params);

            if (res.header.name === 'Response') {
                deviceDataUtil.updateIHostDeviceDataOnline(this._iHostDeviceData.serial_number, isOnline);
            }

            return res;
        } catch (error: any) {
            logger.error('sync device online or offline code error---------------', error);
            return null;
        }
    }


    override syncDeviceStateToIHostByLan(): void | undefined | null {
        try {

            //如果websocket连接着，设备状态以websocket的为准，局域网不同步状态(If the websocket is connected, the device status is based on the websocket, and the LAN is not synchronized.)
            if (wsService.isWsConnected()) {
                return;
            }

            const lanState = deviceDataUtil.getLastLanState(this._deviceId)

            const _subDeviceId = lanState?._subDeviceId

            if (!_subDeviceId) {
                logger.info('not subDeviceId----')
                return
            }

            if (isNeedWait(lanState)) {

                const symbolString = _subDeviceId + JSON.stringify(Object.keys(lanState).sort());


                if (deviceParamsTimerObj[symbolString]) {
                    return;
                }

                tempParams[symbolString] = lanState;

                deviceParamsTimerObj[symbolString] = setTimeout(() => {
                    sendDeviceState(_subDeviceId, tempParams[symbolString]);
                    deviceParamsTimerObj[symbolString] = '';
                }, DELAY_TIME);
                return;
            }

            sendDeviceState(_subDeviceId, lanState);
        } catch (error: any) {
            logger.error('sync device status code uiid130 error--------------------------------', this._deviceId, error);
            return null;
        }
    }





}