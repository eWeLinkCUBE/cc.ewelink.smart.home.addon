import db from './db';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import deviceMapUtil from './deviceMapUtil';
import _ from 'lodash';
import mDnsDataParse from './mDnsDataParse';
import logger from '../log';
import { decode } from 'js-base64';
import EUiid from '../ts/enum/EUiid';
import { SUPPORT_UIID_LIST } from '../constants/uiid';
import IHostDevice from '../ts/interface/IHostDevice';
import getAllRemoteDeviceList from './getAllRemoteDeviceList';
import IRemoteDevice from '../ts/interface/IRemoteDevice';
import { get102DeviceOnline } from './deviceUtil';
import syncDeviceOnlineIHost from '../services/public/syncDeviceOnlineToIHost';
import IHostDeviceData from '../ts/interface/IHostDeviceData';

/** 根据设备id得到ewelink里的设备数据 (Get the device data in ewelink based on the device ID)*/
function getEWeLinkDeviceDataByDeviceId(deviceId: string) {
    const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList') as IEWeLinkDevice[];
    if (!eWeLinkDeviceList) {
        return null;
    }

    const eWeLinkDeviceData = eWeLinkDeviceList.find((item) => item.itemData.deviceid === deviceId);
    if (!eWeLinkDeviceData) {
        return null;
    }
    return eWeLinkDeviceData;
}

/** 生成控制局域网设备的必要参数(Generate necessary parameters for controlling LAN devices) */
export function generateUpdateLanDeviceParams(deviceId: string) {
    const mDnsDeviceData = deviceMapUtil.getMDnsDeviceDataByDeviceId(deviceId)?.deviceData;

    if (!mDnsDeviceData) {
        logger.info('can not find lan device------------------', deviceId);
        return null;
    }

    return {
        ip: mDnsDeviceData.ip ?? mDnsDeviceData.target,
        port: mDnsDeviceData.port,
        deviceid: mDnsDeviceData.deviceId.toString(),
    };
}

//根据设备id获取iHost设备数据(Get iHost device data based on device id)
function getIHostDeviceDataByDeviceId(deviceId: string) {
    const iHostDeviceList = db.getDbValue('iHostDeviceList');
    if (!iHostDeviceList) {
        return null;
    }

    const iHostDeviceData = iHostDeviceList.find((item) => {
        if (!item.tags?.deviceInfo) return false;
        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
        if (deviceInfo) {
            return deviceInfo.deviceId === deviceId;
        }
        return false;
    });
    if (!iHostDeviceData) {
        return null;
    }

    const deviceInfo = JSON.parse(decode(iHostDeviceData.tags.deviceInfo));
    const params: IHostDeviceData =  {
        serial_number: iHostDeviceData.serial_number,
        deviceId: deviceInfo.deviceId,
        devicekey: deviceInfo.devicekey,
        selfApikey: deviceInfo.selfApikey,
        uiid: deviceInfo.uiid,
        deviceInfo,
        isOnline: iHostDeviceData.online,
        capabilityList: iHostDeviceData.capabilities.map((item) => item.capability),
        third_serial_number: deviceInfo?.third_serial_number ?? deviceId,
    };
    return params;
}

function getIHostDeviceDataByThirdSerialNumber(thirdSerialNumber: string) {
    const iHostDeviceList = db.getDbValue('iHostDeviceList');
    if (!iHostDeviceList) {
        return null;
    }

    const iHostDeviceData = iHostDeviceList.find((item) => {
        if (!item.tags?.deviceInfo) return false;
        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
        if (deviceInfo) {
            return deviceInfo.third_serial_number === thirdSerialNumber;
        }
        return false;
    });
    if (!iHostDeviceData) {
        return null;
    }

    const deviceInfo = JSON.parse(decode(iHostDeviceData.tags.deviceInfo));
    return {
        serial_number: iHostDeviceData.serial_number,
        deviceId: deviceInfo.deviceId,
        devicekey: deviceInfo.devicekey,
        selfApikey: deviceInfo.selfApikey,
        uiid: deviceInfo.uiid,
        deviceInfo,
        isOnline: iHostDeviceData.online,
        capabilityList: iHostDeviceData.capabilities.map((item) => item.capability),
        third_serial_number: deviceInfo?.third_serial_number,
        tags: iHostDeviceData.tags,
    };
}

//根据设备id获取iHost设备列表数据，主要是获取rf网关下的子设备(Obtain the iHost device list data based on the device ID, mainly to obtain the sub-devices under the rf gateway)
function getIHostDeviceDataListByDeviceId(deviceId: string) {
    const iHostDeviceList = db.getDbValue('iHostDeviceList');
    if (!iHostDeviceList) {
        return null;
    }
    interface IHostDeviceData extends IHostDevice {
        deviceId: string;
        devicekey: string;
        selfApikey: string;
        uiid: number;
        isOnline: boolean;
        capabilityList: string[];
        third_serial_number: string;
    }

    const iHostDeviceDataList: IHostDeviceData[] = [];

    iHostDeviceList.forEach((item) => {
        if (!item.tags?.deviceInfo || !item.tags._smartHomeConfig) return;

        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
        const rfGatewayConfig = item.tags?._smartHomeConfig.rfGatewayConfig;
        if (deviceInfo.deviceId !== deviceId) return;
        const obj = _.merge(item, {
            serial_number: item.serial_number,
            deviceId: deviceInfo.deviceId,
            devicekey: deviceInfo.devicekey,
            selfApikey: deviceInfo.selfApikey,
            uiid: deviceInfo.uiid,
            deviceInfo,
            isOnline: item.online,
            capabilityList: item.capabilities.map((it) => it.capability),
            third_serial_number: deviceInfo?.third_serial_number ?? deviceId,
            capabilities: item.capabilities,
            rfGatewayConfig,
        });
        iHostDeviceDataList.push(obj);
    });

    return iHostDeviceDataList;
}

/** 根据deviceId得到eWelink设备的uiid (Get the uiid of the e welink device based on the device id) */
function getUiidByDeviceId(deviceId: string) {
    const iHostDeviceData = getIHostDeviceDataByDeviceId(deviceId);
    if (iHostDeviceData) {
        return iHostDeviceData.uiid;
    }
    const eWelinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
    if (!eWelinkDeviceData) {
        return null;
    }
    return eWelinkDeviceData.itemData.extra.uiid as number;
}

/** 获取最近一次的局域网设备消息，lanState (Get the latest LAN device information, lan state) */
function getLastLanState(deviceId: string) {
    const mDnsParams = deviceMapUtil.getMDnsDeviceDataByDeviceId(deviceId);

    if (!mDnsParams) {
        return null;
    }
    const iHostDeviceData = getIHostDeviceDataByDeviceId(deviceId);

    const eWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);

    if (!iHostDeviceData && !eWeLinkDeviceData) {
        return null;
    }
    // 防止mdns上报空数据报错 (Prevent null data from being reported on mdns)
    if (mDnsParams.deviceData.encryptedData === '') {
        return {}
    }
    const state = mDnsDataParse.decryptionData({
        iv: mDnsParams.deviceData.iv,
        key: eWeLinkDeviceData ? eWeLinkDeviceData.itemData.devicekey : iHostDeviceData!.devicekey, //同步设备的时候，devicekey从云端里取，更新设备状态时才从ihost取 (When synchronizing the device, the device key is fetched from the cloud, and when the device status is updated, it is fetched from ihost.)
        data: mDnsParams.deviceData.encryptedData,
    });
    const _subDeviceId = _.get(mDnsParams.deviceData, '_subDeviceId', null)

    if (_subDeviceId) {
        state['_subDeviceId'] = _subDeviceId
    }
    return state;
}

function getEWelinkZigbeeSubDeviceList(zigbeePDeviceId: string) {
    const eWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(zigbeePDeviceId);
    if (!eWeLinkDeviceData) {
        logger.error('eWeLinkDeviceData is not exist when addZigbeeSubDevice');
        return null;
    }

    const { uiid } = eWeLinkDeviceData.itemData.extra;
    if (uiid !== EUiid.uiid_168) {
        return null;
    }
    const list = _.get(eWeLinkDeviceData, 'itemData.params.subDevices', null) as {
        deviceid: string;
        subDevId: string;
        uiid: string;
    }[];
    if (!list) {
        logger.error('subDevices is not exist when addZigbeeSubDevice');
        return null;
    }
    return list.map((item) => item.deviceid);
}

function updateEWeLinkDeviceData(deviceId: string, type: 'device' | 'itemData' | 'params', data: any) {
    let oldEWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
    if (!oldEWeLinkDeviceData) {
        return;
    }
    if (type === 'device') {
        _.extend(oldEWeLinkDeviceData, data);
    } else if (type === 'itemData') {
        _.extend(oldEWeLinkDeviceData.itemData, data);
    } else if (type === 'params') {
        let newData = data;
        const uiid = oldEWeLinkDeviceData.itemData.extra.uiid;
        // TODO：The content in the judgment statement will be moved to the device operation class
        if (uiid === EUiid.uiid_102) {
            oldEWeLinkDeviceData = generateDeviceOnline(oldEWeLinkDeviceData, data);
        }

        //uiid 22 修改彩色之后不改变亮度，防止亮度被设置为0
        if (uiid === EUiid.uiid_22 && _.get(data, 'zyx_mode', null) === 2) {
            newData = _.omit(newData, ['channel0', 'channel1']);
        }
        _.extend(oldEWeLinkDeviceData.itemData.params, newData);
    }

    const eWeLinkDeviceList = db.getDbValue('eWeLinkDeviceList');
    _.remove(eWeLinkDeviceList, (item) => item.itemData.deviceid === deviceId);
    eWeLinkDeviceList.push(oldEWeLinkDeviceData);

    //存入数据库 (Save to database)
    db.setDbValue('eWeLinkDeviceList', eWeLinkDeviceList);
}

function generateDeviceOnline(oldEWeLinkDeviceData: IEWeLinkDevice, params: any) {
    const deviceData = oldEWeLinkDeviceData;
    const oldOnline = get102DeviceOnline(deviceData);
    const newOnline = get102DeviceOnline(deviceData, params);

    if (oldOnline !== newOnline) {
        logger.info('102----------------', params, newOnline);
        syncDeviceOnlineIHost(deviceData.itemData.deviceid, newOnline);
    }
    deviceData.itemData.online = newOnline;
    return deviceData;
}

/**
 * 根据rf网关id和索引获取rf遥控器的serial_number
 * Get the serial number of the rf remote control based on the rf gateway id and index
 */
function getRfSerialNumberByDeviceIdAndIndex(deviceId: string, remoteIndex: number) {
    const remoteDeviceList = getAllRemoteDeviceList(deviceId);
    const remoteId = remoteDeviceList[remoteIndex].smartHomeAddonRemoteId;

    const iHostDeviceDataList = getIHostDeviceDataListByDeviceId(deviceId);
    if (!iHostDeviceDataList) {
        return null;
    }
    const thisItem = iHostDeviceDataList.find((item) => item.third_serial_number === remoteId);
    if (!thisItem) {
        return null;
    }
    return thisItem.serial_number;
}

function getThirdSerialNumberByRfRemote(deviceId: string, remote: IRemoteDevice) {
    logger.info('getThirdSerialNumberByRfRemote--------------------', remote);
    const eWeLinkRemoteId = remote.buttonInfoList.map((item) => item.rfChl).join('-') + 'type' + '-' + remote.type;

    const iHostDeviceDataList = getIHostDeviceDataListByDeviceId(deviceId);
    if (!iHostDeviceDataList) {
        logger.info('getThirdSerialNumberByRfRemote--------------------1');

        return null;
    }
    const thisItem = iHostDeviceDataList.find((item) => {
        const rfGatewayConfig = _.get(item, 'rfGatewayConfig', null) as unknown as IRemoteDevice;
        if (!rfGatewayConfig) {
            logger.info('getThirdSerialNumberByRfRemote--------------------2');

            return false;
        }
        const iHostRemoteId = rfGatewayConfig.buttonInfoList.map((item) => item.rfChl).join('-') + 'type' + '-' + remote.type;
        logger.info('getThirdSerialNumberByRfRemote--------------------3', eWeLinkRemoteId, iHostRemoteId);

        return eWeLinkRemoteId === iHostRemoteId;
    });

    if (!thisItem) {
        return null;
    }
    return thisItem.third_serial_number;
}
/**
 * 更新iHost中设备在线情况
 * Update device online status in iHost
 */
function updateIHostDeviceDataOnline(serial_number: string, online: boolean) {
    let iHostDeviceList = db.getDbValue('iHostDeviceList');
    iHostDeviceList = iHostDeviceList.map((item) => {
        if (item.serial_number === serial_number) {
            item.online = online;
        }
        return item;
    });
    db.setDbValue('iHostDeviceList', iHostDeviceList);
}

/** 判断固件版本是否支持局域网功能 (Determine whether the firmware version supports the LAN function)*/
function isSupportLanControl(eWeLinkDeviceData: IEWeLinkDevice) {
    const { uiid } = eWeLinkDeviceData.itemData.extra;

    if (!SUPPORT_UIID_LIST.includes(uiid)) {
        return false;
    }
    //不支持的功能(Unsupported features)
    const denyFeatures = _.get(eWeLinkDeviceData, ['itemData', 'denyFeatures'], []);

    //如果不支持局域网功能(If the LAN function is not supported)
    if (denyFeatures.includes('localCtl')) {
        return false;
    }
    // TODO：The content in the judgment statement will be moved to the device operation class
    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        //电表模式不支持,只支持开关和电机1,2(Meter mode is not supported, only switches and motors 1,2 are supported.)
        if (![1, 2].includes(eWeLinkDeviceData.itemData.params?.workMode)) {
            return false;
        }
    }

    return true;
}

/**  判断支持局域网加长连接控制 ( Determine whether LAN extended connection control is supported ) */
function isSupportLanWebSocketControl(eWeLinkDeviceData: IEWeLinkDevice) {
    const { uiid } = eWeLinkDeviceData.itemData.extra;

    // TODO：The content in the judgment statement will be moved to the device operation class
    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        //电表模式不支持,只支持开关和电机1,2(Meter mode is not supported, only switches and motors 1,2 are supported.)
        if (![1, 2].includes(eWeLinkDeviceData.itemData.params?.workMode)) {
            return false;
        }
    }
    return true;
}

/** 根据zigbee子设备id拿到zigbee网关id （Get the zigbee gateway id based on the zigbee sub-device id）*/
function getZigbeeParentId(deviceId: string) {
    const iHostDeviceData = getIHostDeviceDataByDeviceId(deviceId);
    if (iHostDeviceData && iHostDeviceData?.deviceInfo?.parentId) {
        return iHostDeviceData?.deviceInfo?.parentId;
    }
    const eWelinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
    if (eWelinkDeviceData) {
        return eWelinkDeviceData.itemData.params?.parentid;
    }
    return null;
}

/** 是否zigbee-U子设备 （Whether zigbee-U sub-device）*/
function isZigbeeUSubDevice(deviceId: string) {
    const parentId = getZigbeeParentId(deviceId);
    if (!parentId) {
        return false;
    }
    const parentUiid = getUiidByDeviceId(parentId);
    return parentUiid === EUiid.uiid_243;
}

export default {
    generateUpdateLanDeviceParams,
    getIHostDeviceDataByDeviceId,
    getEWeLinkDeviceDataByDeviceId,
    getUiidByDeviceId,
    getLastLanState,
    getIHostDeviceDataListByDeviceId,
    getEWelinkZigbeeSubDeviceList,
    updateEWeLinkDeviceData,
    getRfSerialNumberByDeviceIdAndIndex,
    getThirdSerialNumberByRfRemote,
    updateIHostDeviceDataOnline,
    isSupportLanControl,
    isSupportLanWebSocketControl,
    getZigbeeParentId,
    isZigbeeUSubDevice,
    getIHostDeviceDataByThirdSerialNumber
};
