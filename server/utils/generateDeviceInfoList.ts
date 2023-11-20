import IDeviceMap from '../ts/interface/IDeviceMap';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import { SUPPORT_UIID_LIST } from '../utils/deviceDataUtil';
import logger from '../log';
import _ from 'lodash';
import EUiid from '../ts/enum/EUiid';
import zigbeePOnlineMap from '../ts/class/zigbeePOnlineMap';
import EProductMode7016 from '../ts/enum/EProductMode7016';

interface DeviceInfo {
    isOnline: boolean;
    isMyAccount: boolean;
    isSupported: boolean;
    displayCategory: string;
    familyName: string;
    deviceId: string;
    deviceName: string;
    isSynced: boolean;
    subDeviceNum: number;
    networkProtocol: ENetworkProtocolType;
}

enum EType {
    /** 开关插座  (switch socket)*/
    SWITCH = 'switch',
    /** rf网关  (RF gateway)*/
    RF_GATEWAY = 'rfGateway',
    /** 风扇灯  (fan light)*/
    FAN_LIGHT = 'fanLight',
    /** 灯  (lamp)*/
    LIGHT = 'light',
    /** zigbee-p 网关  (gateway)*/
    ZIGBEE_P = 'zigbeeP',
    /** 窗帘  (curtain)*/
    CURTAIN = 'curtain',
    /* 无线按钮  (wireless button)**/
    BUTTON = 'button',
    /* 温湿度传感器 (Temperature and humidity sensor) **/
    TEMPERATURE_AND_HUMIDITY_SENSOR = 'temperatureAndHumiditySensor',
    /* 运动传感器  (motion sensor)**/
    MOTION_SENSOR = 'motionSensor',
    /* 人体存在 运动传感器  (Human presence motion sensor)**/
    PERSON_MOTION_SENSOR = 'personMotionSensor',
    /** 门磁  (Door magnet)*/
    CONTACT_SENSOR = 'contactSensor',
}

enum ENetworkProtocolType {
    LAN = 'lan',
    ZIGBEE = 'zigbee',
}

/** uiid对应的图标类型 (The icon type corresponding to Uiid) */
const UIID_TYPE_LIST = [
    {
        type: EType.SWITCH, //开关插座(switch socket)
        uiidList: [
            1, 2, 3, 4, 6, 7, 8, 9, 14, 15, 32, 77, 78, 126, 128, 133, 138, 139, 140, 141, 160, 161, 162, 163, 165, 165, 182, 191, 209, 210, 211, 212, 1256, 7004, 7010, 2256, 7011,
            3256, 7012, 4256, 7013, 1009, 7005,
        ],
    },
    {
        type: EType.RF_GATEWAY, //rf网关 (RF gateway)
        uiidList: [28],
    },
    {
        type: EType.FAN_LIGHT, //风扇灯 (fan light)
        uiidList: [34],
    },
    {
        type: EType.LIGHT, //灯(light)
        uiidList: [44, 103, 104, 135, 136, 157],
    },
    {
        type: EType.ZIGBEE_P,
        uiidList: [168],
    },
    {
        type: EType.CURTAIN,
        uiidList: [7006, 7015],
    },
    {
        type: EType.BUTTON,
        uiidList: [1000, 7000],
    },
    {
        type: EType.TEMPERATURE_AND_HUMIDITY_SENSOR,
        uiidList: [1770, 7014],
    },
    {
        type: EType.MOTION_SENSOR,
        uiidList: [2026],
    },
    {
        type: EType.CONTACT_SENSOR,
        uiidList: [3026],
    },
    {
        type: EType.PERSON_MOTION_SENSOR,
        uiidList: [7016],
    },
];

/** 生成设备信息，是否已同步，在线离线，是否支持  (Generate device information, whether it has been synchronized, online and offline, whether it is supported) */
export default function (syncedHostDeviceList: string[], mDnsDeviceList: IDeviceMap[], eWeLinkDeviceList: IEWeLinkDevice[]) {
    const deviceList: DeviceInfo[] = [];

    mDnsDeviceList.forEach((mItem) => {
        if (!mItem.deviceId) return;

        const eWeLinkDeviceData = eWeLinkDeviceList.find((eItem) => mItem.deviceId === eItem.itemData.deviceid);

        //默认不在账号下 (Not under the account by default)
        const device = {
            isOnline: true,
            isMyAccount: false,
            isSupported: false,
            displayCategory: '',
            familyName: '',
            deviceId: mItem.deviceId,
            deviceName: '',
            isSynced: false,
            subDeviceNum: 0,
            networkProtocol: ENetworkProtocolType.LAN,
        };
        //在账号下 (under account)
        if (eWeLinkDeviceData) {
            device.isOnline = !!mItem.deviceData.isOnline;
            device.isMyAccount = true;

            device.displayCategory = getDeviceTypeByUiid(eWeLinkDeviceData);
            device.isSupported = judgeIsSupported(eWeLinkDeviceData);
            device.familyName = eWeLinkDeviceData.familyName;
            device.deviceId = mItem.deviceId;
            device.deviceName = eWeLinkDeviceData.itemData.name;
            device.isSynced = syncedHostDeviceList.includes(mItem.deviceId);
            device.subDeviceNum = generateSubDeviceNum(eWeLinkDeviceData);
            device.networkProtocol = ENetworkProtocolType.LAN;
        }

        deviceList.push(device);
        //TODO:
        if (!eWeLinkDeviceData) return;
        const { uiid } = eWeLinkDeviceData.itemData.extra;

        if ([EUiid.uiid_168].includes(uiid)) {
            const subDeviceList = generateSubDeviceList(eWeLinkDeviceData);

            subDeviceList.forEach((item) => {
                const eWeLinkSubDeviceData = eWeLinkDeviceList.find((eItem) => item.deviceId === eItem.itemData.deviceid);
                if (!eWeLinkSubDeviceData) {
                    return;
                }
                const subDevice = {
                    isOnline: isZigbeePSubDevicesOnline(item.deviceId, !!mItem.deviceData.isOnline),
                    isMyAccount: true,
                    isSupported: judgeIsSupported(eWeLinkSubDeviceData),
                    displayCategory: getDeviceTypeByUiid(eWeLinkSubDeviceData),
                    familyName: eWeLinkDeviceData.familyName,
                    deviceId: item.deviceId,
                    deviceName: eWeLinkSubDeviceData ? eWeLinkSubDeviceData.itemData.name : '',
                    isSynced: syncedHostDeviceList.includes(item.deviceId),
                    subDeviceNum: 0,
                    networkProtocol: ENetworkProtocolType.ZIGBEE,
                };
                deviceList.push(subDevice);
            });
        }
    });

    return deviceList;
}
/** 拿到zigbee-p网关子设备数据 (Get zigbee p gateway sub-device data)*/
function generateSubDeviceList(eWeLinkDeviceData: IEWeLinkDevice) {
    const subDevices = eWeLinkDeviceData.itemData.params.subDevices as { deviceid: string; uiid: number }[];
    const subDeviceList = subDevices.map((item) => {
        return { uiid: item.uiid, deviceId: item.deviceid };
    });
    return subDeviceList;
}

/** rf网关、zigbee-p网关设备的子设备数量 (The number of sub-devices of RF gateway and zigbee p gateway devices)*/
function generateSubDeviceNum(eWeLinkDeviceData: IEWeLinkDevice) {
    const { uiid } = eWeLinkDeviceData.itemData.extra;

    if ([EUiid.uiid_28].includes(uiid)) {
        const { zyx_info } = eWeLinkDeviceData.itemData.tags;
        return zyx_info?.length;
    }

    if ([EUiid.uiid_168].includes(uiid)) {
        const { subDevices } = eWeLinkDeviceData.itemData.params;
        return subDevices?.length;
    }
    return 0;
}

/** 根据设备uiid返回设备的类型图标 (Returns the type icon of the device based on the device uiid)*/
function getDeviceTypeByUiid(eWeLinkDeviceData: IEWeLinkDevice) {
    const { uiid } = eWeLinkDeviceData.itemData.extra;

    const thisItem = UIID_TYPE_LIST.find((item) => item.uiidList.includes(uiid));

    if (thisItem) {
        return thisItem.type;
    }
    return EType.SWITCH;
}

/** 判断固件版本是否支持局域网功能 (Determine whether the firmware version supports the LAN function)*/
function judgeIsSupported(eWeLinkDeviceData: IEWeLinkDevice) {
    const { uiid } = eWeLinkDeviceData.itemData.extra;
    //TODO:zigbee-p
    // if (EUiid.uiid_168 === uiid) {
    //     return false;
    // }

    if (!SUPPORT_UIID_LIST.includes(uiid)) {
        return false;
    }
    //不支持的功能(Unsupported features)
    const denyFeatures = _.get(eWeLinkDeviceData, ['itemData', 'denyFeatures'], []);

    //如果不支持局域网功能(If the LAN function is not supported)
    if (denyFeatures.includes('localCtl')) {
        return false;
    }

    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        //电表模式不支持,只支持开关和电机1,2(Meter mode is not supported, only switches and motors 1,2 are supported.)
        if (![1, 2].includes(eWeLinkDeviceData.itemData.params?.workMode)) {
            return false;
        }
    }

    return true;
}

/** 判断zigbee-p子设备在线状态 (Determine the online status of the zigbee p sub-device)*/
function isZigbeePSubDevicesOnline(deviceId: string, zigbeePOnline: boolean) {
    if (zigbeePOnline == false) {
        return false;
    }

    if (!zigbeePOnlineMap.zigbeePSubDevicesMap.has(deviceId)) {
        return false;
    }
    const online = zigbeePOnlineMap.zigbeePSubDevicesMap.get(deviceId);
    return !!online;
}
