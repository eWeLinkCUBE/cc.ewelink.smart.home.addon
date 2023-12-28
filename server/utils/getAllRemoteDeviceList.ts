import _ from 'lodash';
import IRemoteDevice from '../ts/interface/IRemoteDevice';
import deviceDataUtil from './deviceDataUtil';

//获取rf网关下的子设备，uiid28 (Get the sub-device under rf gateway, uiid28)
function getAllRemoteDeviceList(deviceId: string) {
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    const rfList = _.get(eWeLinkDeviceData, ['itemData', 'params', 'rfList'], []) as { rfChl: number; rfVal: string }[];
    const zyx_info = _.get(eWeLinkDeviceData, ['itemData', 'tags', 'zyx_info'], []) as {
        buttonName: { [rfChl: number]: string }[];
        name: string;
        remote_type: '1' | '2' | '3' | '4' | '5' | '6';
        smartHomeAddonRemoteId?: string;
    }[];

    const remoteDeviceList: any = [];
    if (!zyx_info) {
        throw new Error('no zyx_info');
    }

    zyx_info.forEach((item) => {
        if (!item.buttonName) {
            return;
        }

        const buttonInfoList: any = [];

        item.buttonName.forEach((it) => {
            const buttonInfoObj: any = {};
            buttonInfoObj['rfChl'] = `${Object.keys(it)[0]}`;
            buttonInfoObj['name'] = Object.values(it)[0];
            buttonInfoObj['rfVal'] = '';
            const thisItem = rfList.find((rItem) => Number(rItem.rfChl) === Number(Object.keys(it)[0]));
            if (thisItem) {
                buttonInfoObj['rfVal'] = thisItem.rfVal;
            }
            buttonInfoList.push(buttonInfoObj);
        });
        const remoteDeviceObj = {
            name: item.name,
            type: item.remote_type,
            buttonInfoList,
            smartHomeAddonRemoteId: item?.smartHomeAddonRemoteId,
        };
        remoteDeviceList.push(remoteDeviceObj);
    });

    return remoteDeviceList as IRemoteDevice[];
}

export default getAllRemoteDeviceList;
