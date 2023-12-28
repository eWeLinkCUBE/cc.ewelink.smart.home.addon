import _ from 'lodash';
import { syncDeviceInformationToIHost } from '../../api/iHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import { v4 as uuidv4 } from 'uuid';
import EUiid from '../../ts/enum/EUiid';

/**
 * 同步设备能力配置到iHost
 * Synchronize device capability configuration to iHost
 */
export default async function syncDeviceCapabilitiesToIHost(deviceId: string, params: any) {
    try {
        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);

        if (uiid !== EUiid.uiid_154) {
            return;
        }

        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(deviceId);
        if (!iHostDeviceData) {
            return;
        }
        logger.info('params--------------------------------', params);

        const holdReminder = _.get(params, 'holdReminder', null) as {
            enabled: 0 | 1 | boolean;
            switch: 'on' | 'off';
            time: number;
        };

        if (!holdReminder) {
            return;
        }
        holdReminder.enabled = holdReminder.enabled ? true : false;

        const requestParams = {
            event: {
                header: {
                    name: 'DeviceInformationUpdatedReport',
                    message_id: uuidv4(),
                    version: '1',
                },
                endpoint: {
                    serial_number: iHostDeviceData.serial_number,
                    third_serial_number: deviceId,
                },
                payload: {
                    capabilities: [
                        {
                            capability: 'detect-hold',
                            permission: 'read',
                            configuration: holdReminder,
                        },
                    ],
                },
            },
        };

        const res = await syncDeviceInformationToIHost(requestParams);
        if (res && res.header && res.header.name === 'ErrorResponse') {
            logger.info('sync websocket device information to iHost error--------', res, JSON.stringify(requestParams, null, 2));
        }
    } catch (error: any) {
        logger.error('sync device info code error--------------------------------', deviceId, error);
        return null;
    }
}
