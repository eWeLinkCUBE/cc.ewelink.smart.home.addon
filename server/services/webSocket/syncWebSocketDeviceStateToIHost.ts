import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import { v4 as uuidv4 } from 'uuid';
import { syncDeviceStateToIHost } from '../../api/iHost';
import _ from 'lodash';
import db from '../../utils/db';

export default async function syncWebSocketDeviceStateToIHost(deviceId: string, params: any) {
    try {
        const { getIHostDeviceDataByDeviceId, lanStateToIHostState } = deviceDataUtil;

        logger.info('ws listen-------------------', deviceId, params);
        const iHostDeviceData = getIHostDeviceDataByDeviceId(deviceId);

        if (!iHostDeviceData) {
            return;
        }

        const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
        if (!eWeLinkApiInfo) {
            logger.info('no login no sync websocket state----');
            return;
        }

        let state = lanStateToIHostState(deviceId, params);
        logger.info('sync websocket device state------', state);

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
    } catch (error: any) {
        logger.error('sync websocket device state to iHost-----------------------------', error);
        return null;
    }
}
