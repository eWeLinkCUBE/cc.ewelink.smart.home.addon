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
    lanStateToIHostStatePowerDevice,
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
    lanStateToIHostState22,
    lanStateToIHostState102,
    lanStateToIHostState154,
    lanStateToIHostState36,
    lanStateToIHostState173And137,
    lanStateToIHostState59,
    iHostStateToLanStateWebSocket,
    lanStateToIHostState5,
    lanStateToIHostStateMonochromeLamp,
    iHostStateToLanStateMonochromeLamp,
    lanStateToIHostStateBicolorLamp,
    iHostStateToLanStateBicolorLamp,
    lanStateToIHostStateFiveColorLamp,
    lanStateToIHostStateWaterSensor,
    lanStateToIHostStateSmokeDetector,
    lanStateToIHostStateContactSensorWithTamperAlert,
    lanStateToIHostStateTRV,
    iHostStateToLanStateTRV,
    lanStateToIHostStateMotionSensor7002,
    lanStateToIHostState57,
    lanStateToIHostState52,
    lanStateToIHostState11,
    lanStateToIHostState130,
    iHostStateToLanState130,
    lanStateToIHostStateMultiPress,
} from './lanStateAndIHostStateChange';
import EUiid from '../ts/enum/EUiid';
import ECapability from '../ts/enum/ECapability';
import { SUPPORT_UIID_LIST, ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST, ZIGBEE_UIID_TRV_LIST, ZIGBEE_UIID_WATER_SENSOR, coolkitDeviceProfiles } from '../const';
import IHostDevice from '../ts/interface/IHostDevice';
import { SINGLE_MULTI_PROTOCOL_LIST, MULTI_PROTOCOL_LIST, SINGLE_PROTOCOL_LIST } from '../const';
import getAllRemoteDeviceList from './getAllRemoteDeviceList';
import IRemoteDevice from '../ts/interface/IRemoteDevice';
import { get102DeviceOnline } from './deviceUtil';
import syncDeviceOnlineIHost from '../services/public/syncDeviceOnlineToIHost';

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
            capabilitiyList: item.capabilities.map((it) => it.capability),
            third_serial_number: deviceInfo?.third_serial_number ?? deviceId,
            capabilities: item.capabilities,
            rfGatewayConfig,
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
function lanStateToIHostState(deviceId: string, myLanState?: any, actions?: string[], isWebSocket = false) {
    let state;

    if (myLanState) {
        state = myLanState;
    } else {
        state = getLastLanState(deviceId);
    }

    const uiid = getUiidByDeviceId(deviceId);
    if (!uiid) {
        return null;
    }

    let lanState = state;
    let iHostState: any = {};

    if (SINGLE_PROTOCOL_LIST.includes(uiid)) {
        //单通道协议 (single channel protocol)
        lanState = state as ILanStateSingleSwitch;
        const powerState = _.get(lanState, 'switch', null);
        // 7020 单通道协议中 switch 取值为 true/false, 不同于 'on'/'off' (7020 The value of switch in single-channel protocol is true/false, which is different from 'on'/'off')
        const setUiid7020PowerState = () => (powerState ? 'on' : 'off');
        if (powerState !== null) {
            iHostState = {
                power: {
                    powerState: uiid === EUiid.uiid_7020 ? setUiid7020PowerState() : powerState,
                },
            };
        }
    } else if (SINGLE_MULTI_PROTOCOL_LIST.includes(uiid)) {
        //单通道用多通道协议 (Single channel uses multi-channel protocol)
        lanState = state as ILanStateMultipleSwitch;
        const switches = _.get(lanState, 'switches');
        if (switches) {
            iHostState = {
                power: {
                    powerState: switches[0].switch,
                },
            };
        }
    } else if (MULTI_PROTOCOL_LIST.includes(uiid)) {
        //多通道协议 (multi-channel protocol)
        lanState = state as ILanStateMultipleSwitch;
        const switches = _.get(lanState, 'switches');
        const toggle: any = {};

        const toggleLength = getToggleLenByUiid(uiid);

        /**
         * 7021，7022 的多通道协议（lanState）如下: (The multi-channel protocol (lanState) of 7021 and 7022 is as follows)
         * {
         *     switch_00: true, // 通道1开启 (Channel 1 is on)
         *     switch_01: false, // 通道2关闭 (Channel 2 is off)
         *     switch_02: true, // 通道3开启 (Channel 3 is on)
         * }
         */
        if ([EUiid.uiid_7021, EUiid.uiid_7022].includes(uiid)) {
            for (const key in lanState) {
                if (!key.startsWith('switch_')) continue;
                toggle[parseInt(key.split('_')[1]) + 1] = {
                    toggleState: lanState[key] ? 'on' : 'off',
                };
            }
        } else {
            switches &&
                switches.forEach((item: { outlet: number; switch: any }, index: number) => {
                    //去除掉多余的通道 (Remove unnecessary channels)
                    if (index < toggleLength) {
                        toggle[item.outlet + 1] = {
                            toggleState: item.switch,
                        };
                    }
                });
        }

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

    if ([EUiid.uiid_190, EUiid.uiid_182, EUiid.uiid_5].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStatePowerDevice(lanState as any, uiid));
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
        const lanWorkMode = _.get(myLanState, 'workMode', null);
        const eWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
        const eWeLinkWorkMode = _.get(eWeLinkDeviceData, ['itemData', 'params', 'workMode'], null);
        const workMode = lanWorkMode ?? eWeLinkWorkMode;
        if (workMode !== 1) {
            iHostState.toggle && delete iHostState.toggle;
        } else {
            iHostState.percentage && delete iHostState.percentage;
            iHostState['motor-control'] && delete iHostState['motor-control'];
            iHostState['motor-clb'] && delete iHostState['motor-clb'];
        }

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
        _.assign(iHostState, lanStateToIHostState28(lanState as any, actions, isWebSocket));
    }

    // 无线按键 (wireless button)
    if ([EUiid.uiid_1000, EUiid.uiid_7000, EUiid.uiid_1001].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateButton(lanState));
    }

    // 门磁-无拆下能力 (Door magnet, No ability to remove and detect)
    if ([EUiid.uiid_3026].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateContactSensor(lanState));
    }

    // 门磁-有拆下检测能力 (Door magnet with ability to remove and detect)
    if ([EUiid.uiid_7003].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateContactSensorWithTamperAlert(lanState));
    }

    // 窗帘(curtain)
    if ([EUiid.uiid_7006, EUiid.uiid_7015].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateCurtain(lanState, uiid, deviceId));
    }

    //温湿度(Temperature and humidity)
    if ([EUiid.uiid_1770, EUiid.uiid_7014].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateTemAndHum(lanState));
    }

    //运动传感器(motion sensor)
    if ([EUiid.uiid_2026].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateMotionSensor(lanState));
    }

    //运动传感器带明亮度能力7002 (motion sensor uiid 7002 with illumination capability)
    if ([EUiid.uiid_7002].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateMotionSensor7002(lanState));
    }

    //人体存在传感器带光照(Human presence sensor with light)
    if ([EUiid.uiid_7016].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStatePersonExist(lanState));
    }

    if ([EUiid.uiid_22].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState22(lanState));
    }

    if ([EUiid.uiid_102].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState102(lanState, deviceId));
    }

    if ([EUiid.uiid_154].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState154(lanState));
    }

    if ([EUiid.uiid_36].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState36(lanState));
    }

    if ([EUiid.uiid_173, EUiid.uiid_137].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState173And137(lanState));
    }

    if ([EUiid.uiid_59].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState59(lanState));
    }

    if ([EUiid.uiid_5].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState5(lanState));
    }

    // 单色灯 (Monochrome lamp)
    if ([EUiid.uiid_1257].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateMonochromeLamp(lanState));
    }

    // 双色灯 (bicolor lamp)
    if ([EUiid.uiid_1258, EUiid.uiid_7008].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateBicolorLamp(lanState));
    }

    // 五色灯 (five color lamp)
    if (ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST.includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateFiveColorLamp(lanState, deviceId));
    }

    // 水浸 (water sensor)
    if (ZIGBEE_UIID_WATER_SENSOR.includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateWaterSensor(lanState));
    }

    // 烟感 (smoke detector)
    if ([EUiid.uiid_5026].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateSmokeDetector(lanState));
    }

    // 温控阀 (TRV)
    if (ZIGBEE_UIID_TRV_LIST.includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateTRV(lanState, deviceId));
    }

    if ([EUiid.uiid_57].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState57(lanState));
    }

    if ([EUiid.uiid_52].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState52(lanState));
    }

    if ([EUiid.uiid_11].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState11(lanState));
    }

    if ([EUiid.uiid_130].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostState130(lanState));
    }

    if ([EUiid.uiid_1002, EUiid.uiid_1003, EUiid.uiid_1004, EUiid.uiid_1005, EUiid.uiid_1006].includes(uiid)) {
        _.assign(iHostState, lanStateToIHostStateMultiPress(lanState));
    }

    //去掉对象中不合法的值(Remove illegal value)
    Object.keys(iHostState).forEach((key) => {
        if (typeof iHostState[key] === 'object' && Object.keys(iHostState[key]).length === 0) {
            delete iHostState[key];
        }
    });

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
function iHostStateToLanState(deviceId: string, iHostState: IHostStateInterface, isWebSocket = false) {
    const uiid = getUiidByDeviceId(deviceId);
    if (!uiid) {
        return null;
    }

    let lanState = {};
    if (SINGLE_PROTOCOL_LIST.includes(uiid)) {
        const power = _.get(iHostState, 'power', null);
        const setUiid7020Switch = () => power?.powerState === 'on';
        if (power) {
            lanState = { switch: uiid === EUiid.uiid_7020 ? setUiid7020Switch() : power.powerState };
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
        const is7021Or7022 = [EUiid.uiid_7021, EUiid.uiid_7022].includes(uiid);
        if (power) {
            if (is7021Or7022) {
                const toggleLen = getToggleLenByUiid(uiid);
                for (let i = 0; i < toggleLen; i++) {
                    _.set(lanState, `switch_0${i}`, power.powerState === 'on');
                }
            } else {
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
            }
        } else {
            const toggleObj = _.get(iHostState, 'toggle');
            if (toggleObj) {
                if (is7021Or7022) {
                    for (const toggleIndex in toggleObj) {
                        _.set(lanState, `switch_0${parseInt(toggleIndex) - 1}`, toggleObj[toggleIndex].toggleState === 'on');
                    }
                } else {
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
        _.assign(lanState, iHostStateToLanState126And165(iHostState, deviceId, isWebSocket));
    }

    if ([EUiid.uiid_34].includes(uiid)) {
        lanState = _.omit(lanState, ['switches']);
        _.assign(lanState, iHostStateToLanState34(iHostState));
    }

    if ([EUiid.uiid_28].includes(uiid)) {
        _.assign(lanState, iHostStateToLanState28(iHostState, isWebSocket));
    }

    // 窗帘 (curtain)
    if ([EUiid.uiid_7006, EUiid.uiid_7015].includes(uiid)) {
        _.assign(lanState, iHostStateToLanStateCurtain(iHostState));
    }

    // websocket 灯带 (websocket light strip)
    if (
        [EUiid.uiid_59, EUiid.uiid_173, EUiid.uiid_137, EUiid.uiid_22, EUiid.uiid_36, EUiid.uiid_57, EUiid.uiid_52, EUiid.uiid_11, ...ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST].includes(
            uiid
        )
    ) {
        _.assign(lanState, iHostStateToLanStateWebSocket(iHostState, deviceId, uiid));
    }
    if ([EUiid.uiid_1257].includes(uiid)) {
        _.assign(lanState, iHostStateToLanStateMonochromeLamp(iHostState));
    }

    if ([EUiid.uiid_1258, EUiid.uiid_7008].includes(uiid)) {
        _.assign(lanState, iHostStateToLanStateBicolorLamp(iHostState));
    }

    if ([EUiid.uiid_130].includes(uiid)) {
        _.assign(lanState, iHostStateToLanState130(iHostState, deviceId));
    }

    if (ZIGBEE_UIID_TRV_LIST.includes(uiid)) {
        _.assign(lanState, iHostStateToLanStateTRV(iHostState));
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

    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        //电表模式不支持,只支持开关和电机1,2(Meter mode is not supported, only switches and motors 1,2 are supported.)
        if (![1, 2].includes(eWeLinkDeviceData.itemData.params?.workMode)) {
            return false;
        }
    }
    return true;
}

/** 根据zigbee子设备id拿到zigbee网关id */
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

/** 是否zigbee-U子设备 */
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
    iHostStateToLanState,
    getIHostDeviceDataByDeviceId,
    getEWeLinkDeviceDataByDeviceId,
    lanStateToIHostState,
    getToggleLenByUiid,
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
};
