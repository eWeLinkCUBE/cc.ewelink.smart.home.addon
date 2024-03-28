import IDeviceMap from '../ts/interface/IDeviceMap';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import _ from 'lodash';
import EUiid from '../ts/enum/EUiid';
import zigbeePOnlineMap from '../ts/class/zigbeePOnlineMap';
import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST } from '../const';
import getAllRemoteDeviceList from './getAllRemoteDeviceList';
import deviceDataUtil from './deviceDataUtil';
import deviceMapUtil from './deviceMapUtil';

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
    /** rf网关遥控器  (RF gateway remote)*/
    RF_REMOTE = 'rfRemote',
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
    /** 灯带 (light strip)*/
    LIGHT_STRIP = 'lightStrip',
    /** 烟感 (Smoke)*/
    SMOKE_DETECTOR = 'smokeDetector',
    /** 水浸 (flooding)*/
    WATER_LEAK_DETECTOR = 'waterLeakDetector',
    /** 温控阀 (thermostatic valve) */
    THERMOSTAT = 'thermostat',
    /** 堆叠式网关(stacked gateway) */
    ELECTRICITY_GATEWAY = 'electricity_gateway',
}

enum ENetworkProtocolType {
    LAN = 'lan',
    WIFI = 'wifi',
}

/** uiid对应的图标类型 (The icon type corresponding to Uiid) */
const UIID_TYPE_LIST = [
    {
        type: EType.SWITCH, //开关插座(switch socket)
        uiidList: [
            1, 2, 3, 4, 6, 7, 8, 9, 14, 15, 32, 77, 78, 126, 133, 138, 139, 140, 141, 160, 161, 162, 163, 165, 165, 182, 191, 209, 210, 211, 212, 1256, 7004, 7010, 2256, 7011,
            3256, 7012, 4256, 7013, 1009, 7005, 5,
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
        uiidList: [44, 103, 104, 135, 136, 157, 22, 36, 1257, 1258, 7008, 3258, 7009, 52, 57],
    },
    {
        type: EType.ZIGBEE_P,
        uiidList: [168],
    },
    {
        type: EType.CURTAIN,
        uiidList: [7006, 7015, 11],
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
        uiidList: [2026, 7002],
    },
    {
        type: EType.CONTACT_SENSOR,
        uiidList: [3026, 102, 154, 7003],
    },
    {
        type: EType.PERSON_MOTION_SENSOR,
        uiidList: [7016],
    },
    {
        type: EType.LIGHT_STRIP,
        uiidList: [59, 137, 173],
    },
    {
        type: EType.SMOKE_DETECTOR,
        uiidList: [5026],
    },
    {
        type: EType.WATER_LEAK_DETECTOR,
        uiidList: [4026, 7019],
    },
    {
        type: EType.THERMOSTAT,
        uiidList: [7017, 1772],
    },
    {
        type: EType.ELECTRICITY_GATEWAY,
        uiidList: [128],
    },
];

/** 生成设备信息，是否已同步，在线离线，是否支持  (Generate device information, whether it has been synchronized, online and offline, whether it is supported) */
export default function generateDeviceInfoList(syncedHostDeviceList: string[], mDnsDeviceList: IDeviceMap[], eWeLinkDeviceList: IEWeLinkDevice[]) {
    const deviceList: DeviceInfo[] = [];
    //局域网内的设备(Devices within the LAN)
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
            device.isSupported = deviceDataUtil.isSupportLanControl(eWeLinkDeviceData);
            device.familyName = eWeLinkDeviceData.familyName;
            device.deviceId = mItem.deviceId;
            device.deviceName = eWeLinkDeviceData.itemData.name;
            device.isSynced = syncedHostDeviceList.includes(mItem.deviceId);
            device.subDeviceNum = generateSubDeviceNum(eWeLinkDeviceData, eWeLinkDeviceList);
            device.networkProtocol = ENetworkProtocolType.LAN;
        }

        deviceList.push(device);

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
                    isSupported: deviceDataUtil.isSupportLanControl(eWeLinkSubDeviceData),
                    displayCategory: getDeviceTypeByUiid(eWeLinkSubDeviceData),
                    familyName: eWeLinkDeviceData.familyName,
                    deviceId: item.deviceId,
                    deviceName: eWeLinkSubDeviceData ? eWeLinkSubDeviceData.itemData.name : '',
                    isSynced: syncedHostDeviceList.includes(item.deviceId),
                    subDeviceNum: 0,
                    networkProtocol: ENetworkProtocolType.LAN,
                };
                deviceList.push(subDevice);
            });
        }

        if ([EUiid.uiid_28].includes(uiid)) {
            const remoteDeviceList = getAllRemoteDeviceList(mItem.deviceId);

            remoteDeviceList.forEach((item, index) => {
                const subDevice = {
                    isOnline: !!mItem.deviceData.isOnline,
                    isMyAccount: true,
                    isSupported: true,
                    displayCategory: EType.RF_REMOTE,
                    familyName: eWeLinkDeviceData.familyName,
                    deviceId: `${mItem.deviceId}_${index}`,
                    deviceName: item.name,
                    isSynced: typeof item?.smartHomeAddonRemoteId === 'string' && syncedHostDeviceList.includes(item?.smartHomeAddonRemoteId),
                    subDeviceNum: 0,
                    networkProtocol: ENetworkProtocolType.LAN,
                };
                deviceList.push(subDevice);
            });
        }
    });
    //账号下不在局域网的设备(Devices under the account that are not on the LAN)
    eWeLinkDeviceList.forEach((item) => {
        const uiid = item.itemData.extra.uiid;
        const deviceId = item.itemData.deviceid;
        //仅支持websocket的设备(Only devices that support websocket)
        if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            const device = {
                isOnline: item.itemData.online,
                isMyAccount: true,
                isSupported: true,
                displayCategory: getDeviceTypeByUiid(item),
                familyName: item.familyName,
                deviceId,
                deviceName: item.itemData.name,
                isSynced: syncedHostDeviceList.includes(item.itemData.deviceid),
                subDeviceNum: generateSubDeviceNum(item, eWeLinkDeviceList),
                networkProtocol: ENetworkProtocolType.WIFI,
            };
            //去掉局域网中的长连接设备(Remove long-connection devices in the LAN)
            _.remove(deviceList, (t) => t.deviceId === deviceId);
            deviceList.push(device);
        }
        //同时支持局域网和websocket的设备(Devices that support both LAN and websocket)
        if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            const lanDeviceItem = deviceList.find((lanDevice) => lanDevice.deviceId === deviceId);
            const lanDeviceData = deviceMapUtil.getMDnsDeviceDataByDeviceId(deviceId);
            //局域网存在且在线且支持局域网功能不另外加入（The LAN exists and is online and supports the LAN function. No additional additions are required.）
            if (lanDeviceItem && lanDeviceItem.isSupported === true && lanDeviceData && lanDeviceData.deviceData.isOnline) {
                return;
            }

            const device = {
                isOnline: item.itemData.online,
                isMyAccount: true,
                isSupported: true,
                displayCategory: getDeviceTypeByUiid(item),
                familyName: item.familyName,
                deviceId,
                deviceName: item.itemData.name,
                isSynced: syncedHostDeviceList.includes(deviceId),
                subDeviceNum: 0,
                networkProtocol: ENetworkProtocolType.WIFI,
            };
            _.remove(deviceList, (t) => t.deviceId === deviceId);
            deviceList.push(device);
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
function generateSubDeviceNum(eWeLinkDeviceData: IEWeLinkDevice, eWeLinkDeviceList: IEWeLinkDevice[]) {
    const { uiid } = eWeLinkDeviceData.itemData.extra;

    if ([EUiid.uiid_28].includes(uiid)) {
        const { zyx_info } = eWeLinkDeviceData.itemData.tags;
        return zyx_info?.length ?? 0;
    }

    if ([EUiid.uiid_168].includes(uiid)) {
        const { subDevices } = eWeLinkDeviceData.itemData.params;
        return subDevices?.length ?? 0;
    }

    if ([EUiid.uiid_128].includes(uiid)) {
        const subDevices = _.get(eWeLinkDeviceData.itemData.params,'subDevices',[])
        const subDeviceIdList = subDevices.map((item: { deviceid: string }) => item.deviceid);
        //网关中子设备数据不对，去除实际不在的子设备（The sub-device data in the gateway is incorrect. Remove the sub-device that is not actually present.）
        const trueSubDeviceList = eWeLinkDeviceList.filter((item) => subDeviceIdList.includes(item.itemData.deviceid));
        return trueSubDeviceList.length;
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
