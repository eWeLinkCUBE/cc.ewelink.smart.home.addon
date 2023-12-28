import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import { v4 as uuidv4 } from 'uuid';
import { syncDeviceStateToIHost } from '../../api/iHost';
import _ from 'lodash';

export default async function syncZigbeeDeviceStateToIHost(deviceid: string, params: any) {
    try {
        const { getUiidByDeviceId, getIHostDeviceDataByDeviceId, lanStateToIHostState } = deviceDataUtil;
        const iHostDeviceData = getIHostDeviceDataByDeviceId(deviceid);
        const uiid = getUiidByDeviceId(deviceid);

        if (!iHostDeviceData) {
            return;
        }

        const state = lanStateToIHostState(deviceid, params);
        const syncDeviceStateToIHostParams = {
            event: {
                header: {
                    name: 'DeviceStatesChangeReport',
                    message_id: uuidv4(),
                    version: '1',
                },
                endpoint: {
                    serial_number: iHostDeviceData.serial_number,
                    third_serial_number: deviceid,
                },
                payload: {
                    state,
                },
            },
        };

        const res = await syncDeviceStateToIHost(syncDeviceStateToIHostParams);

        if (res && res.header && res.header.name !== 'Response') {
            logger.info('sync zigbee device state to iHost error---', res);
        }
    } catch (error: any) {
        logger.error('sync zigbee device state to iHost code error----', error);
        return null;
    }
}
