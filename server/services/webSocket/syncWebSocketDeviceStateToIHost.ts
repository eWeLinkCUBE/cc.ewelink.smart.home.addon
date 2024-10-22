import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import { v4 as uuidv4 } from 'uuid';
import { syncDeviceStateToIHost } from '../../api/iHost';
import _ from 'lodash';
import db from '../../utils/db';
import EUiid from '../../ts/enum/EUiid';

const DELAY_TIME = 5000;
const deviceParamsTimerObj: any = {};
let tempParams: any = {};

export default async function syncWebSocketDeviceStateToIHost(deviceId: string, params: any, uiid: number) {
    try {
        logger.info('ws listen-------------------', deviceId, params);

        if (isNeedWait(params, uiid)) {
            logger.info('now----------params', params);
            const symbolString = deviceId + JSON.stringify(Object.keys(params).sort());
            tempParams = params;
            logger.info('symbolString---------------', symbolString);
            if (deviceParamsTimerObj[symbolString]) {
                return;
            }

            deviceParamsTimerObj[symbolString] = setTimeout(() => {
                logger.info('now----------tempParams', tempParams);
                sendData(deviceId, tempParams);
                deviceParamsTimerObj[symbolString] = '';
            }, DELAY_TIME);
            return;
        }

        sendData(deviceId, params);
    } catch (error: any) {
        logger.error('sync websocket device state to iHost-----------------------------', error);
        return null;
    }
}

async function sendData(deviceId: string, params: any) {
    const { getIHostDeviceDataByDeviceId, lanStateToIHostState } = deviceDataUtil;

    const iHostDeviceData = getIHostDeviceDataByDeviceId(deviceId);

    if (!iHostDeviceData) {
        return;
    }

    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
    if (!eWeLinkApiInfo) {
        logger.info('no login no sync websocket state----');
        return;
    }
    // zigbee-u子设备离线时候不同步子设备状态
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    if (deviceDataUtil.isZigbeeUSubDevice(deviceId) && eWeLinkDeviceData && eWeLinkDeviceData.itemData.online === false) {
        return;
    }

    let state = lanStateToIHostState(deviceId, params);
    logger.info('sync websocket device state------', JSON.stringify(state, null, 2));

    if (!iHostDeviceData.capabilitiyList.includes('rssi')) {
        state = _.omit(state, ['rssi']);
    }
    if (_.isEmpty(state)) {
        return;
    }
    const syncDeviceStateToIHostParams = {
        event: {
            header: {
                name: 'DeviceStatesChangeReport',
                message_id: uuidv4(),
                version: '1',
            },
            endpoint: {
                serial_number: iHostDeviceData.serial_number,
                third_serial_number: deviceId,
            },
            payload: {
                state,
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
    deviceDataUtil.updateIHostDeviceDataOnline(iHostDeviceData.serial_number, true);
}

//是否需要延迟同步设备状态（Do you need to delay synchronization of device status?）
function isNeedWait(params: any, uiid: number) {
    if (![EUiid.uiid_130].includes(uiid)) {
        return false;
    }
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
