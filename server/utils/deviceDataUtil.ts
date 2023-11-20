import db from './db';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import deviceMapUtil from './deviceMapUtil';
import _ from 'lodash';
import mDnsDataParse from './mDnsDataParse';
import { ILanStateSingleSwitch, ILanStateMultipleSwitch, ILanState126And165, ILanStateSwitch } from '../ts/interface/ILanState';
import { IHostStateInterface } from '../ts/interface/IHostState';
import logger from '../log';
import { decode } from 'js-base64';
import {
    lanStateToIHostState190And182,
    lanStateToIHostStateLight,
    iHostStateToLanStateLight,
    iHostStateToLanState44,
    lanStateToIHostState44,
    lanStateToIHostState181And15,
    iHostStateToLanState15,
    lanStateToIHostState126And165,
    iHostStateToLanState126And165,
    lanStateToIHostState34,
    iHostStateToLanState34,
    iHostStateToLanState28,
    lanStateToIHostState28,
    lanStateToIHostStateButton,
    lanStateToIHostStateContactSensor,
    lanStateToIHostStateCurtain,
    lanStateToIHostStateTemAndHum,
    lanStateToIHostStateMotionSensor,
    iHostStateToLanStateCurtain,
    lanStateToIHostStatePersonExist,
} from './lanStateAndIHostStateChange';
import EUiid from '../ts/enum/EUiid';
import ECapability from '../ts/enum/ECapability';
import { coolkitDeviceProfiles } from '../const';
import IHostDevice from '../ts/interface/IHostDevice';

//当前支持的全部uiid (All currently supported uiids)
export const SUPPORT_UIID_LIST = Object.values(EUiid);
//支持单通道协议的uiid (Support uiid for single channel protocol)
export const SINGLE_PROTOCOL_LIST = [1, 6, 32, 44, 103, 104, 135, 136, 14, 181, 15, 1256, 7004, 7010, 1009, 7005];
//支持多通道协议的uiid (Support uiid for multi-channel protocols)
export const MULTI_PROTOCOL_LIST = [2, 3, 4, 7, 8, 9, 133, 161, 162, 141, 140, 139, 210, 211, 212, 126, 165, 34, 2256, 7011, 3256, 7012, 4256, 7013];
//单通道使用多通道协议的uiid (Single channel uses the uiid of the multi-channel protocol)
export const SINGLE_MULTI_PROTOCOL_LIST = [77, 138, 160, 190, 182, 209, 191];
/** zigbee设备(zigbee设备) */
export const ZIGBEE_UIID_DEVICE_LIST = [168, 1256, 7004, 7010, 2256, 7011, 3256, 7012, 4256, 7013, 1009, 7005, 7006, 7015, 1000, 7000, 1770, 7014, 2026, 7016, 3026];
export const ZIGBEE_UIID_CURTAIN_LIST = [7006, 7015];

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
    return {
        serial_number: iHostDeviceData.serial_number,
        deviceId: deviceInfo.deviceId,
        devicekey: deviceInfo.devicekey,
        selfApikey: deviceInfo.selfApikey,
        uiid: deviceInfo.uiid,
        deviceInfo,
        isOnline: iHostDeviceData.online,
        capabilitiyList: iHostDeviceData.capabilities.map((item) => item.capability),
        third_serial_number: deviceInfo?.third_serial_number ?? deviceId,
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
        capabilitiyList: string[];
        third_serial_number: string;
    }

    const iHostDeviceDataList: IHostDeviceData[] = [];

    iHostDeviceList.forEach((item) => {
        if (!item.tags?.deviceInfo) return;
        const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
        if (deviceInfo.deviceId !== deviceId) return;
        const obj = _.merge(item, {
            serial_number: item.serial_number,
            deviceId: deviceInfo.deviceId,
            devicekey: deviceInfo.devicekey,
            selfApikey: deviceInfo.selfApikey,
            uiid: deviceInfo.uiid,
            deviceInfo,
            isOnline: item.online,
            capabilitiyList: item.capabilities.map((it) => it.capability),
            third_serial_number: deviceInfo?.third_serial_number ?? deviceId,
            capabilities: item.capabilities,
        });
        iHostDeviceDataList.push(obj);
    });

    return iHostDeviceDataList;
}

/**
 * 同步设备到iHost用到，devicekey从eWeLink里拿
 * 同步设备状态到iHost用到，devicekey从iHost里拿
 * 将局域网的设备状态数据格式转换为iHost的state数据格式
 * actions 针对uiid 28设备，actions 支持的按键数组
 */

/**
 * Used to synchronize devices to iHost, get the devicekey from eWeLink
 * Used to synchronize device status to iHost, devicekey is taken from iHost
 * Convert the device status data format of the LAN to the iHost state data format
 * actions For uiid 28 devices, the key array supported by actions
 */
function lanStateToIHostState(deviceId: string, myLanState?: any, actions?: string[]) {
    let state = getLastLanState(deviceId);

    if (myLanState) {
        state = myLanState;
    }

    const uiid = getUiidByDeviceId(deviceId);
    if (!uiid) {
        return null;
    }

    let lanState = state;
    let iHostState: any = {};

    if (uiid === EUiid.uiid_168) {
        logger.info('zigbee-p----------mdns', state);
    }

    if (SINGLE_PROTOCOL_LIST.includes(uiid)) {
        //单通道协议 (single channel protocol)
        lanState = state as ILanStateSingleSwitch;
        const powerState = _.get(lanState, 'switch');
        iHostState = {
            power: {
                powerState: powerState,
            },
        };
    } else if (SINGLE_MULTI_PROTOCOL_LIST.includes(uiid)) {
        //单通道用多通道协议 (Single channel uses multi-channel protocol)
        lanState = state as ILanStateMultipleSwitch;
        const switches = _.get(lanState, 'switches');

        iHostState = {
            power: {
                powerState: switches[0].switch,
            },
        };
    } else if (MULTI_PROTOCOL_LIST.includes(uiid)) {
        //多通道协议 (multi-channel protocol)
        lanState = state as ILanStateMultipleSwitch;
        const switches = _.get(lanState, 'switches');
        const toggle: any = {};

        const toggleLength = getToggleLenByUiid(uiid);

        switches &&
            switches.forEach((item: { outlet: number; switch: any }, index: number) => {
                //去除掉多余的通道 (Remove unnecessary channels)
                if (index < toggleLength) {
                    toggle[item.outlet + 1] = {
                        toggleState: item.switch,
                    };
                }
            });

        iHostState = {
            toggle,
        };
    }
    const rssi = _.get(lanState, 'rssi');
    if (rssi) {
        _.assign(iHostState, {
            rssi: {
                rssi,
            },
        });
    }

    if ([EUiid.uiid_190, EUiid.uiid_182].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState190And182(lanState as any, uiid));
    }

    if ([EUiid.uiid_135, EUiid.uiid_136, EUiid.uiid_103, EUiid.uiid_104].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateLight(lanState as any, uiid));
    }

    if (uiid === EUiid.uiid_44) {
        _.assign(iHostState, lanStateToIHostState44(lanState as any));
    }

    if ([EUiid.uiid_181, EUiid.uiid_15].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState181And15(lanState as any, uiid));
    }

    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState126And165(lanState as any));
        // if (_.get(lanState, 'workMode', null) !== 1) {
        //     iHostState.toggle && delete iHostState.toggle;
        // }

        if (_.isEmpty(iHostState?.toggle)) {
            iHostState.toggle && delete iHostState.toggle;
        }
    }

    if ([EUiid.uiid_34].includes(uiid)) {
        //去除toggle (Remove toggle)
        iHostState.toggle && delete iHostState.toggle;
        _.assign(iHostState, lanStateToIHostState34(lanState as any));
    }

    if ([EUiid.uiid_28].includes(uiid) && actions) {
        _.assign(iHostState, lanStateToIHostState28(lanState as any, actions));
    }

    // 无线按键 (wireless button)
    if ([EUiid.uiid_1000, EUiid.uiid_7000].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateButton(lanState));
    }

    // 门磁(Door magnet)
    if ([EUiid.uiid_3026].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateContactSensor(lanState));
    }

    // 窗帘(curtain)
    if ([EUiid.uiid_7006, EUiid.uiid_7015].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateCurtain(lanState, uiid));
    }

    //温湿度(Temperature and humidity)
    if ([EUiid.uiid_1770, EUiid.uiid_7014].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateTemAndHum(lanState));
    }

    //运动传感器(motion sensor)
    if ([EUiid.uiid_2026].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateMotionSensor(lanState));
    }

    //人体存在传感器带光照(Human presence sensor with light)
    if ([EUiid.uiid_7016].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStatePersonExist(lanState));
    }

    return iHostState;
}

/** 根据uiid得到设备有几个通道 (Get how many channels the device has based on uiid) */
function getToggleLenByUiid(uiid: number) {
    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        return 2;
    }
    //取得该uiid有几个通道 (Get how many channels the uiid has)
    const thisItem = coolkitDeviceProfiles.find((item) => item.uiidList.includes(uiid));
    if (!thisItem) {
        return 1;
    }
    let toggleLength = 0;
    thisItem.capabilities.forEach((item) => {
        if (item.capability === ECapability.TOGGLE) {
            toggleLength++;
        }
    });

    return toggleLength;
}

/**
 * 将iHost的设备状态state转换成局域网设备的state (Convert the device status state of iHost to the state of LAN device)
 * 单通道协议，单通道使用多通道协议，多通道协议 (Single channel protocol, single channel using multi-channel protocol, multi-channel protocol)
 */
function iHostStateToLanState(deviceId: string, iHostState: IHostStateInterface) {
    const uiid = getUiidByDeviceId(deviceId);
    if (!uiid) {
        return null;
    }

    let lanState = {};
    if (SINGLE_PROTOCOL_LIST.includes(uiid)) {
        const power = _.get(iHostState, 'power', null);
        if (power) {
            lanState = { switch: power.powerState };
        }
    } else if (SINGLE_MULTI_PROTOCOL_LIST.includes(uiid)) {
        const power = _.get(iHostState, 'power', null);
        if (power) {
            const switches: ILanStateSwitch[] = [];

            Array(4)
                .fill(null)
                .forEach((item, index) => {
                    switches.push({
                        switch: power.powerState,
                        outlet: index,
                    });
                });

            lanState = { switches };
            //特殊处理 (special handling)
            if (EUiid.uiid_190 === uiid) {
                lanState = { switches: [switches[0]], operSide: 1 };
            }
        }
    } else if (MULTI_PROTOCOL_LIST.includes(uiid)) {
        const power = _.get(iHostState, 'power', null);
        if (power) {
            const switches: ILanStateSwitch[] = [];
            Array(4)
                .fill(null)
                .forEach((item, index) => {
                    switches.push({
                        switch: power.powerState,
                        outlet: index,
                    });
                });

            lanState = { switches };
        } else {
            const toggleObj = _.get(iHostState, 'toggle');
            if (toggleObj) {
                const switches: any = [];
                for (const toggleIndex in toggleObj) {
                    switches.push({
                        switch: toggleObj[toggleIndex].toggleState,
                        outlet: Number(toggleIndex) - 1,
                    });
                }
                lanState = { switches };
            }
        }
    }

    if (uiid === EUiid.uiid_44) {
        _.assign(lanState, iHostStateToLanState44(iHostState));
    }

    if ([EUiid.uiid_135, EUiid.uiid_136, EUiid.uiid_103, EUiid.uiid_104].includes(uiid)) {
        _.assign(lanState, iHostStateToLanStateLight(iHostState, deviceId, uiid));
    }

    if ([EUiid.uiid_15].includes(uiid)) {
        _.assign(lanState, iHostStateToLanState15(lanState));
    }

    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        _.assign(lanState, iHostStateToLanState126And165(iHostState));
    }

    if ([EUiid.uiid_34].includes(uiid)) {
        lanState = _.omit(lanState, ['switches']);
        _.assign(lanState, iHostStateToLanState34(iHostState));
    }

    if ([EUiid.uiid_28].includes(uiid)) {
        _.assign(lanState, iHostStateToLanState28(iHostState));
    }

    // 窗帘 (curtain)
    if ([EUiid.uiid_7006, EUiid.uiid_7015].includes(uiid)) {
        _.assign(lanState, iHostStateToLanStateCurtain(iHostState));
    }

    return JSON.stringify(lanState);
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

    const state = mDnsDataParse.decryptionData({
        iv: mDnsParams.deviceData.iv,
        key: eWeLinkDeviceData ? eWeLinkDeviceData.itemData.devicekey : iHostDeviceData!.devicekey, //同步设备的时候，devicekey从云端里取，更新设备状态时才从ihost取 (When synchronizing the device, the device key is fetched from the cloud, and when the device status is updated, it is fetched from ihost.)
        data: mDnsParams.deviceData.encryptedData,
    });
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

export default {
    MULTI_PROTOCOL_LIST,
    generateUpdateLanDeviceParams,
    iHostStateToLanState,
    getIHostDeviceDataByDeviceId,
    getEWeLinkDeviceDataByDeviceId,
    lanStateToIHostState,
    getToggleLenByUiid,
    getUiidByDeviceId,
    getLastLanState,
    getIHostDeviceDataListByDeviceId,
    getEWelinkZigbeeSubDeviceList,
};
