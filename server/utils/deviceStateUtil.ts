import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, SUPPORT_UIID_LIST, WEB_SOCKET_UIID_DEVICE_LIST } from '../constants/uiid';
import ENetworkProtocol from '../ts/enum/ENetworkProtocol';
import EUiid from '../ts/enum/EUiid';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import deviceDataUtil from './deviceDataUtil';
import _ from 'lodash';
import deviceMapUtil from './deviceMapUtil';
import wsService from '../services/webSocket/wsService';
import logger from '../log';

/**
 * 传入设备id，判断当前设备使用哪个网络（Pass in the device id to determine which network the current device uses.）
 *  优先局域网，其次webSocket（Prioritize LAN, then web socket）
 */
function whichNetworkProtocol(deviceId: string) {
    const uiid = deviceDataUtil.getUiidByDeviceId(deviceId);
    //1、还没支持的设备
    if (!SUPPORT_UIID_LIST.includes(uiid)) {
        return ENetworkProtocol.NONE;
    }
    //2、仅支持websocket的设备
    if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
        return judeWebSocketNetWork();
    }

    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    //未登录的
    if (!eWeLinkDeviceData) {
        return ENetworkProtocol.LAN;
    }

    if (!isSupportedLan(eWeLinkDeviceData)) {
        return judeWebSocketNetWork();
    }

    // TODO：The content in the judgment statement will be moved to the device operation class
    //3、特殊uiid处理
    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        //电表模式不支持,只支持开关和电机1,2(Meter mode is not supported, only switches and motors 1,2 are supported.)
        if (![1, 2].includes(eWeLinkDeviceData.itemData.params?.workMode)) {
            return ENetworkProtocol.NONE;
        }
    }

    //4、支持局域网和websocket的设备
    if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
        //局域网不在线
        const lanDeviceInfo = deviceMapUtil.getMDnsDeviceDataByDeviceId(deviceId);
        if (lanDeviceInfo && lanDeviceInfo?.deviceData.isOnline == true) {
            return ENetworkProtocol.LAN;
        }

        if (wsService.isWsExist()) {
            return judeWebSocketNetWork();
        }
        return ENetworkProtocol.NONE;
    }

    //5、支持局域网的设备
    return ENetworkProtocol.LAN;
}

/** 设备固件是否支持局域网控制（Does the device firmware support LAN control?） */
function isSupportedLan(eWeLinkDeviceData: IEWeLinkDevice) {
    //不支持的功能(Unsupported features)
    const denyFeatures = _.get(eWeLinkDeviceData, ['itemData', 'denyFeatures'], []);

    //如果不支持局域网功能(If the LAN function is not supported)
    if (denyFeatures.includes('localCtl')) {
        return false;
    }
    return true;
}

//没有websocket就没有网络（Without webSockets there would be no network）
function judeWebSocketNetWork() {
    if (wsService.isWsExist()) {
        return ENetworkProtocol.WS;
    }
    return ENetworkProtocol.NONE;
}

/** 传入设备id或者设备数据，判断该设备是否处于局域网中（Pass in the device ID or device data to determine whether the device is in the LAN）  */
function isInLan(value: string): boolean;
function isInLan(value: IEWeLinkDevice): boolean;
function isInLan(value: string | IEWeLinkDevice) {
    let eWeLinkDeviceData;
    let deviceId;

    if (typeof value === 'string') {
        eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(value);
        deviceId = value;
    } else {
        eWeLinkDeviceData = value;
        deviceId = value.itemData.deviceid;
    }
    //未登陆判断为局域网
    if (!eWeLinkDeviceData) {
        logger.info('isInLan ---- no login', deviceId)
        return true;
    }

    const lanDeviceInfo = deviceMapUtil.getMDnsDeviceDataByDeviceId(deviceId);

    const isSupportedLan = deviceDataUtil.isSupportLanControl(eWeLinkDeviceData);
    //设备局域网在线(Device LAN online)
    if (lanDeviceInfo && lanDeviceInfo?.deviceData.isOnline == true && isSupportedLan) {
        return true
    }
    return false
}

/** 设备长连接在线 （Device long connection online）*/
function isInWsProtocol(deviceId: string) {
    const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(deviceId);
    if (!eWeLinkDeviceData) {
        return false
    }
    return wsService.isWsConnected() && eWeLinkDeviceData.itemData.online == true
}

export default {
    whichNetworkProtocol,
    isInLan,
    isInWsProtocol
};
