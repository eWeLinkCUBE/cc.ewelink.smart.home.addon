

import logger from '../../../log';
import _ from 'lodash'
import deviceDataUtil from '../../../utils/deviceDataUtil';
import { syncDeviceStateToIHost } from '../../../api/iHost';
import iHostDeviceMap from '../../../ts/class/iHostDeviceMap';
import { v4 as uuidv4 } from 'uuid';
import wsService from '../../webSocket/wsService';
import { isObjectSubset } from '../../../utils/tool';



const DELAY_TIME = 5000;
const deviceParamsTimerObj: any = {};
const tempParams: any = {};


export default function syncDeviceState(parentId: string) {
    try {

        //如果websocket连接着，设备状态以websocket的为准，局域网不同步状态(If the websocket is connected, the device status is based on the websocket, and the LAN is not synchronized.)
        if (wsService.isWsConnected()) {
            return;
        }

        let lanState = deviceDataUtil.getLastLanState(parentId)

        const _subDeviceId = lanState?._subDeviceId

        if (!_subDeviceId) {
            logger.info('not subDeviceId----')
            return
        }

        if (isNeedWait(lanState)) {

            lanState = _.merge(lanState, { key: Date.now() })

            const symbolString = _subDeviceId + JSON.stringify(Object.keys(lanState).sort());


            if (deviceParamsTimerObj[symbolString]) {
                return;
            }

            tempParams[symbolString] = lanState;

            deviceParamsTimerObj[symbolString] = setTimeout(() => {
                sendData(_subDeviceId, tempParams[symbolString]);
                deviceParamsTimerObj[symbolString] = '';
            }, DELAY_TIME);
            return;
        }

        sendData(_subDeviceId, lanState);
    } catch (error: any) {
        logger.error('sync device status code uiid130 error--------------------------------', parentId, error);
        return null;
    }
}


async function sendData(_subDeviceId: string, lanState: any) {


    const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(_subDeviceId);
    if (!iHostDeviceData) {
        return;
    }

    const newIHostState = deviceDataUtil.lanStateToIHostState(_subDeviceId, lanState);

    if (!newIHostState) {
        return;
    }


    const oldIHostState = iHostDeviceMap.deviceMap.get(_subDeviceId)?.state;

    let state = newIHostState;
    //屏蔽短时间内相同设备状态的上报 (Block reports of the same device status within a short period of time)
    if (isObjectSubset(oldIHostState, newIHostState)) {
        return
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
                third_serial_number: _subDeviceId,
            },
            payload: {
                state,
            },
        },
    };
    logger.info('sync device status-----uiid130', iHostDeviceData.deviceId, JSON.stringify(state));

    iHostDeviceMap.deviceMap.set(_subDeviceId, { updateTime: Date.now(), state: _.merge(oldIHostState, state) });

    syncDeviceStateToIHost(params);
    return null;
}





//是否需要延迟同步设备状态（Do you need to delay synchronization of device status?）
function isNeedWait(lanState: any) {

    const params = _.omit(lanState, '_subDeviceId')

    const paramsLength = Object.keys(params).length;

    if (paramsLength !== 5) {
        return false;
    }

    const requiredFields = [
        'current_00',
        'voltage_00',
        'actPow_00',
        'reactPow_00',
        'apparentPow_00',

        'current_01',
        'voltage_01',
        'actPow_01',
        'reactPow_01',
        'apparentPow_01',

        'current_02',
        'voltage_02',
        'actPow_02',
        'reactPow_02',
        'apparentPow_02',

        'current_03',
        'voltage_03',
        'actPow_03',
        'reactPow_03',
        'apparentPow_03',
    ];

    for (const key in params) {
        if (!requiredFields.includes(key)) {
            return false;
        }
    }

    return true;
}
