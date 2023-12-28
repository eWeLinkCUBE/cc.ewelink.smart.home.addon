import _ from 'lodash';
import { updateDeviceInfo } from '../../api/iHost';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
import EUiid from '../../ts/enum/EUiid';
/** 同步已经学习的rf按键值到iHost (Synchronize the learned rf key values to iHost)*/
export default async function syncTagsRfChlToIHost(deviceId: string) {
    try {
        const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);
        // 当前只有uiid 28用到这个接口 (Currently only uiid 28 uses this interface)
        if (![EUiid.uiid_28].includes(uiid)) {
            return;
        }

        const lanState = deviceDataUtil.getLastLanState(deviceId);

        if (!lanState) {
            return;
        }

        const lanStateArr = Object.entries(lanState);

        const rfChlItemArr = lanStateArr.find((item) => item[0].indexOf('rfChl') > -1); // [ 'rfChl3', '0FE600A00190578008']

        if (!rfChlItemArr) {
            return;
        }

        const rfChl = rfChlItemArr[0].split('rfChl')[1];
        const rfVal = rfChlItemArr[1] as string;

        const iHostDeviceDataList = deviceDataUtil.getIHostDeviceDataListByDeviceId(deviceId);

        if (!iHostDeviceDataList) return;

        iHostDeviceDataList.forEach(async (item) => {
            /**
            * [
                { rfChl: '0', name: '按键1', rfVal: '0FBE00AA0186578001' },
                { rfChl: '1', name: '按键2', rfVal: '0FC800A00186578004' },
                { rfChl: '2', name: '按键3', rfVal: '' },
            ] */
            let buttonInfoList = _.get(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList']) as {
                rfChl: number | string;
                rfVal: string;
                name: string;
            }[];

            const buttonItem = buttonInfoList.find((tItem) => Number(tItem.rfChl) === Number(rfChl));

            if (!buttonItem) {
                return;
            }
            buttonInfoList = buttonInfoList.map((bItem) => {
                if (Number(bItem.rfChl) === Number(rfChl)) {
                    buttonItem.rfVal = rfVal;
                    bItem = buttonItem;
                }
                return bItem;
            });
            _.set(item.tags, ['_smartHomeConfig', 'rfGatewayConfig', 'buttonInfoList'], buttonInfoList);

            const params = {
                tags: item.tags,
            };

            await updateDeviceInfo(item.serial_number, params);
        });
    } catch (error: any) {
        logger.error('sync device info code error--------------------------------', deviceId, error);
        return null;
    }
}
