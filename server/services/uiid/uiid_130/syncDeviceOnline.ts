import _ from 'lodash';
import { syncDeviceOnlineToIHost } from '../../../api/iHost';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../../log';
import deviceDataUtil from '../../../utils/deviceDataUtil';
import wsService from '../../webSocket/wsService';
import EUiid from '../../../ts/enum/EUiid';

/** 设备上下线状态上报 (Report device online and offline status)*/
export default async function syncDeviceOnline(parentId: string, isOnline: boolean) {
    try {

        const lanState = deviceDataUtil.getLastLanState(parentId)

        const _subDeviceId = lanState?._subDeviceId

        if (!_subDeviceId) {
            logger.info('not subDeviceId----')
            return
        }

        const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(_subDeviceId);

        if (!iHostDeviceData) {
            return;
        }


        //在线状态相同不更新状态 (If the online status is the same, the status will not be updated.)
        if (iHostDeviceData.isOnline === isOnline) {
            return;
        }

        // 设备局域网离线
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

        const params = {
            event: {
                header: {
                    name: 'DeviceOnlineChangeReport',
                    message_id: uuidv4(),
                    version: '1',
                },
                endpoint: {
                    serial_number: iHostDeviceData.serial_number,
                    third_serial_number: _subDeviceId,
                },
                payload: {
                    online: isOnline,
                },
            },
        };

        logger.info('sync device online or offline------uiid130', parentId, EUiid.uiid_130, _subDeviceId, isOnline);
        const res = await syncDeviceOnlineToIHost(params);

        if (res.header.name === 'Response') {
            deviceDataUtil.updateIHostDeviceDataOnline(iHostDeviceData.serial_number, isOnline);
        }
    } catch (error: any) {
        logger.error('sync device online or offline code uiid130 error------------------------------------------------', error);
        return null;
    }
}
