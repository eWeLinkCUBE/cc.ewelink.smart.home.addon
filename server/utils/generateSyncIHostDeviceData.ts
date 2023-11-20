import logger from '../log';
import EUiid from '../ts/enum/EUiid';
import db from './db';
import config from '../config';
import deviceMapUtil from './deviceMapUtil';
import deviceDataUtil from './deviceDataUtil';
import getEWeLinkDevice from '../services/public/getEWeLinkDevice';
import getZigbeePAllDeviceList from '../services/zigbeeP/getZigbeePAllDeviceList';
import _ from 'lodash';
import getState126And165 from '../services/public/getState126And165';
import ECapability from '../ts/enum/ECapability';
import { coolkitDeviceProfiles, capabilityAndCategory126And165List, sensorTypeObj, capabilityAndCategory7016 } from '../const';
import EProductMode7016 from '../ts/enum/EProductMode7016';
import ISmartHomeConfig from '../ts/interface/ISmartHomeConfig';
import EPermission from '../ts/enum/EPermission';
import IEWeLinkDevice from '../ts/interface/IEWeLinkDevice';
import IRemoteDevice from '../ts/interface/IRemoteDevice';
import { encode } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';
import ECategory from '../ts/enum/ECategory';

export const ZIGBEE_UIID_DEVICE_LIST = [168, 1256, 7004, 7010, 2256, 7011, 3256, 7012, 4256, 7013, 1009, 7005, 7006, 7015, 1000, 7000, 1770, 7014, 2026, 7016, 3026];
export const ZIGBEE_UIID_CURTAIN_LIST = [7006, 7015];

const { getEWeLinkDeviceDataByDeviceId, lanStateToIHostState, MULTI_PROTOCOL_LIST } = deviceDataUtil;

/** 生成要同步的iHost端的设备数据 (Generate device data on the ihost side to be synchronized)*/
async function generateSyncIHostDeviceData(deviceId: string) {
    let eWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
    if (!eWeLinkDeviceData) {
        return null;
    }

    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
    if (!eWeLinkApiInfo) {
        return null;
    }

    const { uiid } = eWeLinkDeviceData.itemData.extra;
    const { brandName = '', devicekey, apikey, productModel } = eWeLinkDeviceData.itemData;

    const service_address = `${config.localIp}/api/v1/device/${deviceId}`;

    if ([EUiid.uiid_182, EUiid.uiid_190].includes(uiid)) {
        const timeZone = _.get(eWeLinkDeviceData, ['itemData', 'params', 'timeZone'], null);
        if (timeZone === null) {
            logger.info('no timeZone-----------------', deviceId);
            await getEWeLinkDevice(deviceId);
        }
    }
    const deviceInfoObj: any = {
        deviceId,
        devicekey,
        selfApikey: apikey,
        uiid,
        account: eWeLinkApiInfo.userInfo.account,
        service_address,
    };

    const mDnsDeviceData = deviceMapUtil.getMDnsDeviceDataByDeviceId(deviceId);

    let iHostState: any = {};

    if (mDnsDeviceData) {
        iHostState = lanStateToIHostState(deviceId);
    }
    let myLanState = null;
    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        myLanState = await getState126And165(deviceId);
        iHostState = lanStateToIHostState(deviceId, myLanState);
    }

    // 同步zigbee-p子设备为通道设备时，获取设备的通道state (When the synchronized zigbee p sub-device is a channel device, obtain the channel state of the device)
    if (ZIGBEE_UIID_DEVICE_LIST.includes(uiid)) {
        //  zigbee-p子设备把网关设备id也同步，才能未登录控制 (The Zigbee p sub-device also synchronizes the gateway device ID so that it can be controlled without logging in.)
        const zigbeePDeviceId = eWeLinkDeviceData.itemData.params.parentid;
        const zigbeePEWelinkDeviceData = getEWeLinkDeviceDataByDeviceId(zigbeePDeviceId);
        if (!zigbeePEWelinkDeviceData) {
            return null;
        }

        const { devicekey, apikey } = zigbeePEWelinkDeviceData.itemData;
        //通过控制网关去控制子设备，所以需要网关的devicekey (Control the sub-device through the control gateway, so the deviceke of the gateway is requiredy)
        deviceInfoObj.devicekey = devicekey;
        deviceInfoObj.selfApikey = apikey;

        _.set(deviceInfoObj, 'parentId', zigbeePDeviceId);
        const allZigbeeDevices = await getZigbeePAllDeviceList(zigbeePDeviceId);

        const deviceState = allZigbeeDevices && allZigbeeDevices.find((item) => item.deviceid === deviceId);
        if (deviceState) {
            myLanState = deviceState?.params;
            iHostState = lanStateToIHostState(deviceId, myLanState);
        }

        // zigbee 子设备需要同步电量数据 (Zigbee sub-devices need to synchronize power data)
        if (_.get(myLanState, 'battery', null) === null) {
            const battery = _.get(eWeLinkDeviceData, 'itemData.params.battery', null);
            battery !== null && _.set(iHostState, 'battery.battery', battery);
        }

        // zigbee 子设备并且是窗帘，需要同步校准的状态(motorClb)，当前的百分比(curPercent) (The zigbee sub-device is a curtain and needs to be synchronized and calibrated (motorClb), the current percentage (curPercent))
        if (ZIGBEE_UIID_CURTAIN_LIST.includes(uiid)) {
            // 电机校准状态 (Motor calibration status)
            let motorClb = _.get(eWeLinkDeviceData, 'itemData.params.motorClb', null);
            //如果窗帘在addon停止之后校准了，获取云端数据 (If the curtains are calibrated after addon is stopped, get cloud data)
            if (motorClb === 'calibration' || motorClb === null) {
                await getEWeLinkDevice(deviceId);
            }
            eWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
            if (!eWeLinkDeviceData) {
                return null;
            }

            motorClb = _.get(eWeLinkDeviceData, 'itemData.params.motorClb', null);
            motorClb !== null && _.set(iHostState, 'motor-clb.motorClb', motorClb);

            // 进度状态 (progress status)
            const curPercent = _.get(eWeLinkDeviceData, 'itemData.params.curPercent', null);
            curPercent !== null && curPercent <= 100 && _.set(iHostState, 'percentage.percentage', curPercent);

            // 7015 窗帘的校准状态上报异常，未校准时上报 motorClb: 'normal' 且 curPercent: 255。
            // 7015 The calibration status of the curtain is abnormal. When it is not calibrated, motorClb: 'normal' and curPercent: 255 are reported.
            if (uiid === 7015) {
                // 当前百分比为 255 时，将7015窗帘同步为未校准状态
                // When the current percentage is 255, synchronize the 7015 curtains to an uncalibrated state
                curPercent === 255 && _.set(iHostState, 'motor-clb.motorClb', 'calibration');
            }
        }
        if ([EUiid.uiid_1770].includes(uiid)) {
            //拿云端数据 (Get cloud data)
            if (_.get(myLanState, 'temperature', null) === null || _.get(myLanState, 'humidity', null) === null) {
                await getEWeLinkDevice(deviceId);
            }

            if (_.get(myLanState, 'temperature', null) === null) {
                const temperature = (eWeLinkDeviceData.itemData.params?.temperature / 100).toFixed(1);
                _.set(iHostState, 'temperature.temperature', Number(temperature));
            }
            if (_.get(myLanState, 'humidity', null) === null) {
                const humidity = (eWeLinkDeviceData.itemData.params?.humidity / 100).toFixed(0);
                _.set(iHostState, 'humidity.humidity', Number(humidity));
            }
        }
    }

    if (!iHostState) {
        return null;
    }

    const { display_category, capabilities } = await getDisplayCategoryAndCapabilitiesByUiid(uiid, iHostState, myLanState, eWeLinkDeviceData);

    if (display_category === '' || capabilities.length === 0) {
        return null;
    }

    let capabilitiyList = capabilities;

    //同步190设备到iHost需要设置时区 (Synchronizing 190 devices to iHost requires setting the time zone)
    if ([EUiid.uiid_190, EUiid.uiid_182].includes(uiid)) {
        capabilitiyList = capabilities.map((item: any) => {
            if (item.capability === ECapability.POWER_CONSUMPTION) {
                item.configuration.timeZoneOffset = eWeLinkDeviceData && eWeLinkDeviceData.itemData.params?.timeZone;
            }
            return item;
        });
    }
    //设备温湿度范围 (Equipment temperature and humidity range)
    if ([EUiid.uiid_15, EUiid.uiid_181].includes(uiid)) {
        const sensorType = eWeLinkDeviceData.itemData.params?.sensorType as string;

        capabilitiyList = capabilities.map((item: any) => {
            if (item.capability === ECapability.HUMIDITY) {
                const range = _.get(sensorTypeObj, [sensorType, 'humRange'], null);
                if (range) {
                    _.set(item, ['configuration', 'range'], range);
                }
            }

            if (item.capability === ECapability.TEMPERATURE) {
                const range = _.get(sensorTypeObj, [sensorType, 'temRange'], null);
                if (range) {
                    _.set(item, ['configuration', 'range'], range);
                }
            }
            return item;
        });
    }

    //给iHost用的配置 (Configuration for iHost)
    const _smartHomeConfig: ISmartHomeConfig = {};
    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        _smartHomeConfig.isShowModeTip = true;
    }

    capabilitiyList = _.uniqWith(capabilitiyList, _.isEqual);

    //多通道设备的通道名称同步 (Channel name synchronization for multi-channel devices)
    let toggle;
    if (MULTI_PROTOCOL_LIST.includes(uiid)) {
        const toggleNameObj = _.get(eWeLinkDeviceData.itemData.tags, 'ck_channel_name', null);
        if (toggleNameObj) {
            toggle = incrementKeys(toggleNameObj);
        }
    }
    //温湿度设备的温度单位同步 (Temperature unit synchronization of temperature and humidity equipment)
    let temperature_unit;
    if ([EUiid.uiid_15, EUiid.uiid_181].includes(uiid)) {
        const temperatureUnit = _.get(eWeLinkDeviceData.itemData.tags, 'temperatureUnit', null);
        if (temperatureUnit) {
            temperature_unit = temperatureUnit === 'centigrade' ? 'c' : 'f';
        }
    }
    if ([EUiid.uiid_1770].includes(uiid)) {
        const templateUnit = _.get(eWeLinkDeviceData.itemData.tags, 'templateUnit', null);
        if (templateUnit) {
            temperature_unit = templateUnit;
        }
    }
    // 7014 带屏温湿度传感器，从 itemData.params 中取温度单位 (7014 Temperature and humidity sensor with screen, get the temperature unit from itemData.params)
    if ([EUiid.uiid_7014].includes(uiid)) {
        // 0: 摄氏度，1: 华氏度
        // 0: Celsius, 1: Fahrenheit
        const templateUnit = _.get(eWeLinkDeviceData.itemData, 'params.tempUnit', null);
        if (templateUnit !== null) {
            temperature_unit = templateUnit === 1 ? 'f' : 'c';
        }
    }

    const deviceInfo = encode(JSON.stringify(deviceInfoObj));

    return {
        third_serial_number: deviceId,
        name: eWeLinkDeviceData.itemData.name,
        display_category,
        capabilities: capabilitiyList,
        state: iHostState,
        manufacturer: brandName,
        model: productModel,
        tags: {
            deviceInfo,
            version: config.nodeApp.version,
            _smartHomeConfig,
            toggle,
            temperature_unit,
        },
        firmware_version: eWeLinkDeviceData.itemData?.params?.fwVersion ?? '0.0',
        service_address,
    };
}

/** 根据uiid获取设备类别和能力 (Get device category and capabilities based on uiid) */
async function getDisplayCategoryAndCapabilitiesByUiid(uiid: EUiid, state: any, myLanState: any, eWeLinkDeviceData: IEWeLinkDevice) {
    let display_category = '';
    let capabilities = [];

    if ([EUiid.uiid_126, EUiid.uiid_165].includes(uiid)) {
        const workMode = _.get(myLanState, 'workMode', null);
        //电表模式不支持 (Meter mode is not supported)
        if (workMode === null || workMode === 3) {
            return { display_category: '', capabilities: [] };
        }
        const capObj = capabilityAndCategory126And165List[workMode];
        display_category = capObj.display_category;
        capabilities = capObj.capabilities;
        return {
            display_category,
            capabilities,
        };
    }

    if ([EUiid.uiid_7016].includes(uiid)) {
        const { productModel } = eWeLinkDeviceData.itemData;
        return capabilityAndCategory7016[productModel as EProductMode7016];
    }

    const thisItem = coolkitDeviceProfiles.find((item) => item.uiidList.includes(uiid));
    if (!thisItem) {
        return { display_category: '', capabilities: [] };
    }

    capabilities = thisItem.capabilities;
    display_category = thisItem.category;

    if (_.get(state, 'rssi')) {
        capabilities.push({
            capability: ECapability.RSSI,
            permission: EPermission.READ,
        });
    }

    if (_.get(eWeLinkDeviceData, 'itemData.params.battery', null) !== null) {
        capabilities.push({
            capability: ECapability.BATTERY,
            permission: EPermission.READ,
        });
    }

    return {
        display_category,
        capabilities,
    };
}

/** 将toggle里的通道key加一 (Add one to the channel key in the toggle) */
function incrementKeys(obj: { [key: number]: string }): { [key: number]: string } {
    const result: { [key: number]: string } = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parseInt(key) + 1;
            result[newKey] = obj[key];
        }
    }

    return result;
}

/** 生成uiid28 rf网关下的设备同步的数据 (Generate data synchronized by devices under uiid28 rf gateway) */
function generateSyncIHostDeviceDataList28(deviceId: string, remoteDeviceList: IRemoteDevice[]) {
    const eWeLinkDeviceData = getEWeLinkDeviceDataByDeviceId(deviceId);
    if (!eWeLinkDeviceData) {
        return null;
    }

    const eWeLinkApiInfo = db.getDbValue('eWeLinkApiInfo');
    if (!eWeLinkApiInfo) {
        return null;
    }

    const { uiid, model } = eWeLinkDeviceData.itemData.extra;
    const { brandName = '', devicekey, apikey } = eWeLinkDeviceData.itemData;

    const service_address = `${config.localIp}/api/v1/device/${deviceId}`;

    if (!remoteDeviceList) {
        return null;
    }
    const syncIHostDeviceDataList: any = [];

    remoteDeviceList.forEach((item) => {
        const display_category = ECategory.BUTTON;

        const buttonInfoList = item.buttonInfoList;

        const actions = buttonInfoList.map((aItem) => aItem.rfChl);

        const capabilitiyList = [
            {
                capability: ECapability.PRESS,
                permission: EPermission.READ_WRITE,
                configuration: {
                    // 能力配置，可选。(Capability configuration, optional.)
                    // 按键动作，可选，默认“singlePress”、“doublePress”、“longPress”、"0"；如果配置则全部覆盖
                    // Key action, optional, defaults to "single press", "double press", "long press", "0"; if configured, all will be covered
                    actions,
                },
            },
        ];

        const third_serial_number = `${deviceId}_${uuidv4()}`;

        const deviceInfo = encode(
            JSON.stringify({
                deviceId,
                devicekey,
                selfApikey: apikey,
                uiid,
                account: eWeLinkApiInfo.userInfo.account,
                service_address,
                third_serial_number,
            })
        );

        //rf网关bug，同步时要去掉state,防止ihost产生操作日志，只针对按键设备
        //Rf gateway bug, state needs to be removed during synchronization to prevent ihost from generating operation logs, only for key devices
        const syncIHostDeviceData = {
            third_serial_number,
            name: item.name,
            display_category,
            capabilities: capabilitiyList,
            manufacturer: brandName,
            model,
            state: {},
            tags: {
                deviceInfo,
                version: config.nodeApp.version,
                _smartHomeConfig: {
                    rfGatewayConfig: {
                        deviceName: item.name,
                        buttonInfoList,
                        type: item.type,
                    },
                },
            },
            firmware_version: eWeLinkDeviceData.itemData?.params?.fwVersion ?? '0.0',
            service_address,
        };
        syncIHostDeviceDataList.push(syncIHostDeviceData);
    });

    return syncIHostDeviceDataList;
}

export { generateSyncIHostDeviceData, generateSyncIHostDeviceDataList28 };
