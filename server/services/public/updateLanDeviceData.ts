import axios, { AxiosError } from 'axios';
import mDnsDataParse from '../../utils/mDnsDataParse';
import deviceDataUtil from '../../utils/deviceDataUtil';
import logger from '../../log';
enum ERequestMethod {
    GET = 'get',
    POST = 'post',
}
const deviceAxiosInstance = axios.create({
    timeout: 5000, // 超时设定(Timeout setting)
    headers: { Accept: 'application/json' },
});
// 'content-type': 'application/json',

/** 请求局域网设备 (Request LAN device) */
async function requestDevice(deviceId: string, devicekey: string, selfApikey: string, state: string, path: string, method: ERequestMethod = ERequestMethod.POST) {
    try {
        const params = deviceDataUtil.generateUpdateLanDeviceParams(deviceId);

        logger.info('requestDevice--------------------------------params', path, deviceId, state);
        if (!params || !state) {
            logger.error('request device error ---------------', params, state);
            return null;
        }

        const { ip, port, deviceid } = params;

        const iv = `abcdef${Date.now()}abcdef`.slice(0, 16);

        const reqData = {
            iv: mDnsDataParse.encryptionBase64(iv),
            deviceid,
            selfApikey,
            encrypt: true,
            sequence: `${Date.now()}`,
            data: mDnsDataParse.encryptionData({
                iv,
                data: state,
                key: devicekey,
            }),
        };
        const startTime = Date.now();

        let res: any;
        if (method === ERequestMethod.GET) {
            res = await deviceAxiosInstance.get(`http://${ip}:${port}/zeroconf/${path}`);
        } else if (method === ERequestMethod.POST) {
            res = await deviceAxiosInstance.post(`http://${ip}:${port}/zeroconf/${path}`, reqData);
        }

        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        logger.info('request device res time -----------------------', deviceId, elapsedTime + 'ms', ip, state, res.data);

        return res.data as {
            error: number;
            iv?: string;
            data?: string;
        };
    } catch (error: any) {
        logger.error('request device res error---------------', deviceId, error);
        return null;
    }
}

/** 控制单通道协议 (Control single channel protocol) */
const setSwitch = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'switch');
};

/** 控制多通道协议 (Control multi-channel protocols) */
const setSwitches = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'switches');
};

/** 调整灯的模式及亮度、色温、颜色 (Adjust the mode, brightness, color temperature, and color of the light)*/
const setDimmable = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'dimmable');
};

/** 获取指定小时的历史用电量（uiid 190）
 * start 获取指定范围小时数的历史用电量的开始时间点
 * end 获取指定范围小时数的历史用电量的结束时间点
 */
/** Get the historical power consumption for a specified hour (uiid 190)
 *  start Get the start time point of historical power consumption in the specified range of hours
 *  end Get the end time point of historical power consumption in the specified range of hours
 */
const getHoursKwh = async (deviceId: string, devicekey: string, selfApikey: string, start: number, end: number) => {
    const state = JSON.stringify({
        getHoursKwh: {
            start,
            end,
        },
    });
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'getHoursKwh');
};

/**
 * 182
 */
const get186DaysKwh = async (deviceId: string, devicekey: string, selfApikey: string) => {
    const state = JSON.stringify({
        h186DaysKwh: 'get',
    });
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'h186DaysKwh');
};

/**
 * 126 获取单个设备的所有状态
 * 126 Get all status of a single device
 */
const getState = async (deviceId: string, devicekey: string, selfApikey: string) => {
    const state = JSON.stringify({});
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'getState');
};

/** 打开关闭灯 (turn on off light) */
const setLight = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'light');
};

/** 打开关闭风扇，调节风速 (Turn the fan on and off and adjust the wind speed) */
const setFan = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'fan');
};

/** 控制窗帘位置 (Control curtain position) */
const setCurtainLocation = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'location');
};

/** 控制窗帘电机 (Control curtain motor)*/
const setCurtainMotorTurn = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'motorTurn');
};

/** 发送通道键值 (Send channel key value)*/
const setRfButton = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'transmit');
};

/**
 * 获取设备所有数据,如果设备为网关，则获取网关及其所有子设备的数据
 * Get all the data of the device. If the device is a gateway, get the data of the gateway and all its sub-devices.
 * */
const getAllDevices = async (deviceId: string, devicekey: string, selfApikey: string) => {
    const state = JSON.stringify({});
    return await requestDevice(deviceId, devicekey, selfApikey, state, 'devices', ERequestMethod.GET);
};

/** zigbee-p 子设备控制  (zigbee-p subdevice control)*/
const subDeviceControl = async (deviceId: string, devicekey: string, selfApikey: string, state: string) => {
    const iHostDeviceData = deviceDataUtil.getIHostDeviceDataByDeviceId(deviceId);
    const parentId = iHostDeviceData?.deviceInfo.parentId;

    const newState = JSON.stringify({
        deviceid: deviceId,
        params: JSON.parse(state),
    });

    return await requestDevice(parentId, devicekey, selfApikey, newState, 'subdev/control');
};

export default {
    setSwitch,
    setSwitches,
    setDimmable,
    getHoursKwh,
    get186DaysKwh,
    getState,
    setLight,
    setFan,
    setCurtainLocation,
    setCurtainMotorTurn,
    setRfButton,
    getAllDevices,
    subDeviceControl,
};
