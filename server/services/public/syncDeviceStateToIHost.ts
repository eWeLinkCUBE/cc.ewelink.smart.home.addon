import _ from 'lodash';
import { syncDeviceStateToIHost } from '../../api/iHost';
import { v4 as uuidv4 } from 'uuid';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import iHostDeviceMap from '../../ts/class/iHostDeviceMap';
import EUiid from '../../ts/enum/EUiid';
import ECapability from '../../ts/enum/ECapability';
import { LAN_WEB_SOCKET_UIID_DEVICE_LIST } from '../../const';
import wsService from '../webSocket/wsService';
/** 设备状态上报  (Equipment status reporting)*/
export default async (deviceId: string) => {
    try {
        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(deviceId);

        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);

        if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            // if (uiid === 28) {
            //     const lanState = deviceDataUtil.getLastLanState(deviceId);
            //     logger.info('28-------------lan', lanState);
            // }
            //如果websocket连接着，设备状态以websocket的为准，局域网不同步状态(If the websocket is connected, the device status is based on the websocket, and the LAN is not synchronized.)
            if (wsService.isWsConnected()) {
                return;
            }
        }

        if ([EUiid.uiid_28].includes(uiid)) {
            syncDeviceState28(deviceId);
            return;
        }

        const newState = deviceDataUtil.lanStateToIHostState(deviceId);

        if (!iHostDeviceData) {
            return;
        }

        if (!newState) {
            return;
        }

        const oldState = iHostDeviceMap.deviceMap.get(deviceId)?.state;

        let state = newState;

        //屏蔽短时间内相同设备状态的上报 (Block reports of the same device status within a short period of time)
        if (JSON.stringify(newState) === JSON.stringify(oldState)) {
            return;
        }

        //修复uiid 77 设备，能力和数据不符情况 (Fix the inconsistency between uiid 77 equipment, capabilities and data)
        if (!iHostDeviceData.capabilitiyList.includes('rssi')) {
            state = _.omit(state, ['rssi']);
        }
        const params = {
            event: {
                header: {
                    name: 'DeviceStatesChangeReport',
                    message_id: uuidv4(),
                    version: '1',
                },
                endpoint: {
                    serial_number: iHostDeviceData?.serial_number,
                    third_serial_number: deviceId,
                },
                payload: {
                    state,
                },
            },
        };

        logger.info('sync device status-----', iHostDeviceData.deviceId, JSON.stringify(state));

        const nowTime = Date.now();

        iHostDeviceMap.deviceMap.set(deviceId, { updateTime: nowTime, state });

        syncDeviceStateToIHost(params);

        // 确认这个请求是成功的 (Confirm that the request was successful)
        // if (res && res.header && res.header.name === 'Response') {
        //     iHostDeviceMap.deviceMap.set(deviceId, { updateTime: nowTime, state });
        // }

        return null;
    } catch (error: any) {
        logger.error('sync device status code error--------------------------------', deviceId, error);
        return null;
    }
};

function syncDeviceState28(deviceId: string) {
    const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);

    if (!iHostDeviceDataList) {
        return;
    }

    iHostDeviceDataList.forEach((item) => {
        const pressCap = item.capabilities.find((it) => it.capability === ECapability.PRESS);
        if (!pressCap) return;
        const actions = pressCap.configuration?.actions;

        if (!actions) return;

        const oldState = iHostDeviceMap.deviceMap.get(item.third_serial_number)?.state;

        const newState = deviceDataUtil.lanStateToIHostState(deviceId, null, actions);

        let state = _.cloneDeep(newState);
        if (!state || _.isEmpty(state)) {
            return;
        }

        //屏蔽短时间内相同设备状态的上报
        // Block reports of the same device status within a short period of time
        if (JSON.stringify(newState) === JSON.stringify(oldState)) {
            return;
        }

        if (!item.capabilitiyList.includes('rssi')) {
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
                    version: '1',
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
        logger.info('sync device state ----------------------', deviceId, state);
        syncDeviceStateToIHost(params);
    });
}
