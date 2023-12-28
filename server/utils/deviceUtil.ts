import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';

//uiid 102 在线逻辑
export const get102DeviceOnline = (device: IEWeLinkDevice, newParams?: any) => {
    let { params } = device.itemData;
    if (newParams) {
        params = newParams;
    }

    const offlineTime = 125 * 60 * 1000;
    const currentTime = Date.now();
    const actionTime = new Date(params.actionTime || 1000).getTime();
    const lastUpdateTime = new Date(params.lastUpdateTime || 1000).getTime();
    return currentTime - actionTime < offlineTime || currentTime - lastUpdateTime < offlineTime;
};
