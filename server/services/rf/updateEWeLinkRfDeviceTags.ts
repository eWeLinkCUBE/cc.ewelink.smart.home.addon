import CkApi from './../../lib/coolkit-api';
import _ from 'lodash';
import logger from '../../log';
import deviceDataUtil from '../../utils/deviceDataUtil';
import { v4 as uuidv4 } from 'uuid';
import getEWeLinkDevice from '../public/getEWeLinkDevice';
import getAllRemoteDeviceList from '../../utils/getAllRemoteDeviceList';

export default async function updateEWeLinkRfDeviceTags(deviceId: string, needRequest: boolean) {
    try {
        logger.info('to update device tags', deviceId);
        //先获取最新的tags数据(Get the latest tags data first)
        if (needRequest) {
            await getEWeLinkDevice(deviceId);
        }
        const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
        if (!eWeLinkDeviceData) {
            throw new Error('no eWeLinkDeviceData');
        }

        logger.info('updateEWeLinkRfDeviceTags------------------', deviceId);

        const tags = _.get(_.cloneDeep(eWeLinkDeviceData.itemData), ['tags']);
        const zyx_info = _.get(tags, ['zyx_info']) as { smartHomeAddonRemoteId: string; buttonName: Array<{ rfChl: string }>; remote_type: string; name: string }[];

        if (!zyx_info) {
            return;
        }
        const isLackRemoteId = zyx_info.some((item) => {
            return _.isEmpty(item?.smartHomeAddonRemoteId);
        });

        if (!isLackRemoteId) {
            logger.info('already update----');
            return true;
        }

        if (!zyx_info) {
            return;
        }

        zyx_info.forEach((item, remoteIndex) => {
            const remoteDeviceList = getAllRemoteDeviceList(deviceId);
            const remoteDevice = remoteDeviceList[remoteIndex];
            if (_.isEmpty(item?.smartHomeAddonRemoteId)) {
                const third_serial_number = deviceDataUtil.getThirdSerialNumberByRfRemote(deviceId, remoteDevice);
                let smartHomeAddonRemoteId;
                if (third_serial_number) {
                    logger.info('has smartHomeAddonRemoteId-----------------------', third_serial_number, item, item.name);
                    smartHomeAddonRemoteId = third_serial_number;
                } else {
                    logger.info('no smartHomeAddonRemoteId----------------------', item.name);
                    smartHomeAddonRemoteId = `${deviceId}_${uuidv4()}`;
                }
                _.set(tags, ['zyx_info', remoteIndex, 'smartHomeAddonRemoteId'], smartHomeAddonRemoteId);
            }
        });

        // const iHostDeviceData = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);

        logger.info('tags------------------', tags);

        const res = await CkApi.device.updateDeviceTag({
            deviceid: deviceId,
            tags,
        });

        logger.info('tags------------------res', res);

        if (res.error === 0) {
            deviceDataUtil.updateEWeLinkDeviceData(deviceId, 'device', res.data.updatedThing);
            return true;
        }
        return false;
    } catch (error: any) {
        logger.error('updateEWeLinkRfDeviceTags code error---------------------------', error);
        return null;
    }
}
