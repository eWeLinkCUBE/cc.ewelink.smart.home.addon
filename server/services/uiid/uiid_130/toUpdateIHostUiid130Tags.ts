import { syncDeviceInformationToIHost, updateDeviceInfo } from '../../../api/iHost';
import logger from '../../../log';
import EUiid from '../../../ts/enum/EUiid';
import db from '../../../utils/db';
import deviceDataUtil from '../../../utils/deviceDataUtil';
import getIHostSyncedDeviceList from '../../public/getIHostSyncDeviceList';
import { decode, encode } from 'js-base64';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

/** 
 * 修改tags，tags里的devicekey有误，拿到云端设备时，修正devicekey
 * 错误：子设备的devicekey
 * 正确：网关的devicekey
 * Modify tags. The devicekey in tags is wrong. When you get the cloud device, correct the devicekey.
 * Error: devicekey for child device
 * Correct: devicekey of the gateway
 */
export default async function toUpdateIHostUiid130Tags() {
    try {
        logger.info('check devicekey----')
        await getIHostSyncedDeviceList();

        const iHostDeviceDataList = db.getDbValue('iHostDeviceList')
        // 将已同步的uiid130检查tags并更新（Check the synchronized uiid130 tags and update it）
        for (const item of iHostDeviceDataList) {
            if (!item.tags?.deviceInfo) continue;

            const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
            if (deviceInfo.uiid !== EUiid.uiid_130) continue;

            const parentEWelinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceInfo.parentId)
            if (!parentEWelinkDeviceData) continue;

            const correctDevicekey = parentEWelinkDeviceData.itemData.devicekey
            // 检查已同步的uiid130的tags里的devicekey是否为网关的devicekey，如不是，更新成网关的devicekey(Check whether the devicekey in the synchronized uiid130 tags is the devicekey of the gateway. If not, update it to the devicekey of the gateway.)
            if (deviceInfo.devicekey === correctDevicekey) continue


            const newDeviceInfo = _.merge(deviceInfo, { devicekey: correctDevicekey })
            _.set(item.tags, ['deviceInfo'], encode(JSON.stringify(newDeviceInfo)));
            const params = {
                tags: item.tags,
            };
            logger.info('update uiid130 tags----', params)

            // 更新ihost的tags(更新ihost的tags)
            await updateDeviceInfo(item.serial_number, params);

            const requestParams = {
                event: {
                    header: {
                        name: 'DeviceInformationUpdatedReport',
                        message_id: uuidv4(),
                        version: '1',
                    },
                    endpoint: {
                        serial_number: item.serial_number,
                        third_serial_number: deviceInfo.deviceId,
                    },
                    payload: {
                        capabilities: item.capabilities,
                        tags: item.tags
                    },
                },
            };
            // 更新open api的tags (更新open api的tags)
            await syncDeviceInformationToIHost(requestParams);
        }
    } catch (error: any) {
        logger.error('sync device info code error--------------------------------', error);
    }
}
