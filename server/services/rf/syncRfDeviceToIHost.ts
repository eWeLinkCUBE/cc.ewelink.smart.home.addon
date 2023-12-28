import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { syncDeviceToIHost } from '../../api/iHost';
import logger from '../../log';
import getAllRemoteDeviceList from '../../utils/getAllRemoteDeviceList';
import { generateSyncIHostDeviceData28 } from '../../utils/generateSyncIHostDeviceData';
import updateEWeLinkRfDeviceTags from '../rf/updateEWeLinkRfDeviceTags';

/** 同步eWeLink设备rf gateway遥控器到iHost (Synchronize eWelink device rf gateway remote to iHost) */
export default async function syncRfDeviceToIHost(deviceId: string, remoteIndex: number) {
    try {
        const isOk = await updateEWeLinkRfDeviceTags(deviceId, true);
        if (!isOk) {
            throw new Error('error updating device');
        }
        const remoteDeviceList = getAllRemoteDeviceList(deviceId);
        const syncDevice = generateSyncIHostDeviceData28(deviceId, remoteDeviceList[remoteIndex]);

        const endpoints: any = [syncDevice];

        if (endpoints.length === 0) {
            return null;
        }

        const params = {
            event: {
                header: {
                    name: 'DiscoveryRequest',
                    message_id: uuidv4(),
                    version: '1',
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
        logger.error('sync device to iHost code error-----------------------------', deviceId, remoteIndex, error);
        return null;
    }
}
