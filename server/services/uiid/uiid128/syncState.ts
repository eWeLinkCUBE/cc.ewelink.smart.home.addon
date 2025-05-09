import { syncDeviceStateToIHost } from "../../../api/iHost";
import iHostDeviceMap from "../../../ts/class/iHostDeviceMap";
import { IHostStateInterface } from "../../../ts/interface/IHostState";
import { ILanState130 } from "../../../ts/interface/ILanState";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import wsService from "../../webSocket/wsService";

export async function sendDeviceState(_subDeviceId: string, iHostState: IHostStateInterface) {

    //如果websocket连接着，设备状态以websocket的为准，局域网不同步状态(If the websocket is connected, the device status is based on the websocket, and the LAN is not synchronized.)
    if (wsService.isWsConnected()) {
        return;
    }

    const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(_subDeviceId);
    if (!iHostDeviceData) {
        return;
    }

    const newIHostState = iHostState

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
    if (!iHostDeviceData.capabilityList.includes('rssi')) {
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
                serial_number: iHostDeviceData?.serial_number,
                third_serial_number: _subDeviceId,
            },
            payload: {
                state,
            },
        },
    };

    iHostDeviceMap.deviceMap.set(_subDeviceId, { updateTime: Date.now(), state: _.merge(oldIHostState, state) });

    syncDeviceStateToIHost(params);
}


//是否需要延迟同步设备状态（Do you need to delay synchronization of device status?）
export function isNeedWait(lanState: ILanState130) {

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

/**
 * 检查一个对象是否包含另一个对象(Check if an object contains another object)
 * @param obj - 被检查的对象 (the object being inspected)
 * @param partial - 要检查的部分对象(Some objects to check)
 * @returns boolean - 是否包含(Does it contain)
 */
function isObjectSubset(obj: any, partial: any): boolean {
    if (typeof obj !== "object" || typeof partial !== "object" || obj === null || partial === null) {
        return false;
    }

    return Object.keys(partial).every((key) => {
        if (typeof partial[key] === "object" && partial[key] !== null) {
            // 如果 partial[key] 是对象，则递归检查
            return isObjectSubset(obj[key], partial[key]);
        }
        // 否则直接比较值
        return obj[key] === partial[key];
    });
}