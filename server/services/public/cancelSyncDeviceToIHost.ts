import { getUiidOperateInstance, deleteUiidOperateInstance } from '../../utils/deviceOperateInstanceMange';

/** 取消同步eWeLink设备到iHost (Unsynchronize eWelink device to iHost)*/
export default async function cancelSyncDeviceToIHost(deviceId: string) {
    let realDeviceId, remoteIndex;
    if (deviceId.indexOf('_') > -1) {
        realDeviceId = deviceId.split('_')[0];
        remoteIndex = Number(deviceId.split('_')[1]);
    } else {
        realDeviceId = deviceId;
    }

    const operateInstance = getUiidOperateInstance(realDeviceId);
    const res = await operateInstance?.cancelSyncDeviceToIHost(remoteIndex);
    // 取消同步之后删除设备操作实例
    deleteUiidOperateInstance(deviceId);
    return res
}
