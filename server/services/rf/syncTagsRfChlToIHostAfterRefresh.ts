import _ from 'lodash';
import { updateDeviceInfo } from '../../api/iHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import EUiid from '../../ts/enum/EUiid';
import getAllRemoteDeviceList from '../../utils/getAllRemoteDeviceList';
/**
 * 从云端拿到最新的rf按键学习数据后，把按键值同步到iHost
 * After getting the latest rf key learning data from the cloud, synchronize the key to iHost
 */
export default async function syncTagsRfChlToIHostAfterRefresh(deviceId: string) {
    try {
        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);
        //当前只有uiid 28用到这个接口 (Currently only uiid 28 is used这个接口)
        if (![EUiid.uiid_28].includes(uiid)) {
            return;
        }

        const eWeLinkRemoteDeviceList = getAllRemoteDeviceList(deviceId);

        const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);

        if (!iHostDeviceDataList) return;

        iHostDeviceDataList.forEach(async (item) => {
            /**
            * [
                { rfChl: '0', name: '按键1', rfVal: '0FBE00AA0186578001' },
                { rfChl: '1', name: '按键2', rfVal: '0FC800A00186578004' },
                { rfChl: '2', name: '按键3', rfVal: '' },
            ] */
            const iHostButtonInfoList = _.get(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList'], []) as {
                rfChl: string;
                rfVal: string;
                name: string;
            }[];

            eWeLinkRemoteDeviceList.forEach(async (it) => {
                const eWeLinkButtonList = it.buttonInfoList;
                //生成标识 Generate ID
                const eWeLinkRfChlString = eWeLinkButtonList.map((e) => e.rfChl).join('-');
                const iHostRfChlString = iHostButtonInfoList.map((e) => e.rfChl).join('-');
                if (eWeLinkRfChlString !== iHostRfChlString) {
                    return;
                }
                const eWeLinkRfValString = eWeLinkButtonList.map((e) => e.rfVal).join('-');
                const iHostRfValString = iHostButtonInfoList.map((e) => e.rfVal).join('-');
                if (eWeLinkRfValString !== iHostRfValString) {
                    _.set(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList'], eWeLinkButtonList);

                    const params = {
                        tags: item.tags,
                    };

                    updateDeviceInfo(item.serial_number, params);
                }
            });
        });
    } catch (error: any) {
        logger.error('sync device info after refresh code error--------------------------------', deviceId, error);
        return null;
    }
}
