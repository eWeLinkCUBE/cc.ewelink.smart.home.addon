import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { syncDeviceToIHost } from '../../api/iHost';
import logger from '../../log';
import { generateSyncIHostDeviceData } from '../../utils/generateSyncIHostDeviceData';

/** 同步eWeLink设备到iHost (Synchronize eWelink device to iHost) */
export default async function syncDeviceIHost(deviceIdList: string[]) {
    try {
        const endpoints: any = [];

        for (const item of deviceIdList) {
            const endpointObj = await generateSyncIHostDeviceData(item);
            if (endpointObj) {
                endpoints.push(endpointObj);
            }
        }

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
        logger.error('sync device to iHost code error-----------------------------', deviceIdList, error);
        return null;
    }
}
