import DeviceMapClass from '../ts/class/deviceMap';
import dayjs from 'dayjs';
import { IMdnsParseRes } from '../ts/interface/IMdns';
import syncDeviceOnlineToIHost from '../services/public/syncDeviceOnlineToIHost';
import config from '../config';
import logger from '../log';
import db from './db';
import _ from 'lodash';
import mdns from './initMdns';
import { decode } from 'js-base64';
import deviceDataUtil from './deviceDataUtil';
import ping from 'ping';
import { WEB_SOCKET_UIID_DEVICE_LIST, ZIGBEE_UIID_DEVICE_LIST } from '../const';
import { sleep } from './timeUtils';

const { disappearTime } = config.timeConfig;

//更新已搜索到的设备列表 (Update the list of discovered devices)
async function setOnline(params: IMdnsParseRes) {
    let saveParams: any = params;
    //解决uiid 77 丢a记录没有上报问题， (Solve the problem of uiid 77 losing a record and not reporting it)
    if (DeviceMapClass.deviceMap.has(params.deviceId)) {
        const oldDevice = DeviceMapClass.deviceMap.get(params.deviceId);
        saveParams = params;
        if (!params.ip) {
            saveParams.ip = oldDevice?.deviceData.ip;
        }
    }

    saveParams.isOnline = true;
    DeviceMapClass.deviceMap.set(params.deviceId, {
        discoveryTime: Date.now(),
        deviceData: saveParams,
    });
    syncDeviceOnlineToIHost(params.deviceId, true);
}

//更新了局域网设备里的ip，从a记录里取 (Updated the ip in the LAN device and took it from the a record)
function updateAData(deviceIdDomain: string, ip: string) {
    const deviceId = deviceIdDomain.split('.')[0].split('eWeLink_')[1];
    if (DeviceMapClass.deviceMap.has(deviceId)) {
        const oldDevice = DeviceMapClass.deviceMap.get(deviceId);
        oldDevice!.deviceData.ip = ip;
        DeviceMapClass.deviceMap.set(deviceId, {
            discoveryTime: Date.now(),
            deviceData: oldDevice!.deviceData,
        });
    }
}

/** 设置离线状态 (Set offline status)*/
async function setOffline() {
    //网关切换wifi的情况下，将已同步的设备但是不在局域网中的设备离线 (When the gateway switches to wifi, devices that have been synchronized but are not in the LAN will be offline)
    const iHostDeviceList = db.getDbValue('iHostDeviceList');

    if (iHostDeviceList) {
        const deviceIdList = iHostDeviceList.map((item) => {
            if (!item.tags?.deviceInfo) return null;
            const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
            if (deviceInfo) {
                return { deviceId: deviceInfo.deviceId as string, parentId: deviceInfo?.parentId as string };
            }
            return null;
        });

        _.remove(deviceIdList, (item) => item === null);

        for (const item of deviceIdList) {
            if (!item) {
                return;
            }

            const uiid = deviceDataUtil.getUiidByDeviceId(item.deviceId);
            //排除只支持websocket的设备（Exclude devices that only support websocket）
            if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
                continue;
            }
            //zigbee-p 子设备，只判断网关离线的情况，把子设备离线掉 (The zigbee-p sub-device only determines the offline status of the gateway and takes the sub-device offline.)
            if (ZIGBEE_UIID_DEVICE_LIST.includes(uiid)) {
                if (item?.parentId) {
                    if (!DeviceMapClass.deviceMap.has(item.parentId)) {
                        await sleep(50);
                        syncDeviceOnlineToIHost(item.deviceId, false);
                    }
                }
                continue;
            }
            //局域网设备离线 (lan device offline)
            if (!DeviceMapClass.deviceMap.has(item.deviceId)) {
                await sleep(50);
                syncDeviceOnlineToIHost(item.deviceId, false);
            }
        }
    }

    //正常流程判断 (Normal process judgment)
    const nowTime = Date.now();
    const deviceList = [...DeviceMapClass.deviceMap].map((item) => {
        return {
            deviceId: item[0],
            discoveryTime: item[1].discoveryTime,
            deviceData: item[1].deviceData,
        };
    });

    if (deviceList.length === 0) return;

    logger.info(
        'lan deviceList-----',
        deviceList.map((t) => [t.deviceId, dayjs(nowTime).diff(dayjs(t.discoveryTime), 'seconds'), t.deviceData.ip])
    );
    //遍历设备列表给状态 (Iterate through the device list giving status)
    for (const item of deviceList) {
        //设备发现时间和当前时间的间隔  (The interval between device discovery time and current time)
        const seconds = dayjs(nowTime).diff(dayjs(item.discoveryTime), 'seconds');

        //一定时间没扫描到，已同步的ihost设备下线 (It has not been scanned for a certain period of time, and the synchronized ihost device is offline.)
        if (seconds > disappearTime) {
            const pingRes = await ping.promise.probe(item.deviceData.ip, {
                extra: ['-c', '10'],
            });

            logger.info('pingRes-------', item.deviceData.deviceId, pingRes.alive, 'packetLoss---', pingRes.packetLoss, 'avg---', pingRes.avg);
            if (pingRes.alive) {
                item.deviceData.isOnline = true;
                DeviceMapClass.deviceMap.set(item.deviceId, {
                    discoveryTime: Date.now(),
                    deviceData: item.deviceData,
                });
                logger.info('ping and sync online status-----true', item.deviceId);
                syncDeviceOnlineToIHost(item.deviceId, true);
            } else {
                item.deviceData.isOnline = false;
                DeviceMapClass.deviceMap.set(item.deviceId, {
                    discoveryTime: item.discoveryTime,
                    deviceData: item.deviceData,
                });
                logger.info('ping and sync online status-----false', item.deviceId);
                //防止多次并发请求，服务端没有响应（Prevent multiple concurrent requests and no response from the server）
                await sleep(50);
                syncDeviceOnlineToIHost(item.deviceId, false);
            }
        }
    }
}

/** 设备没有ip的时候,发一次A类型请求查询 (When the device does not have an IP address, send a type A request to query.) */
async function mDnsQueryA(deviceId: string, target: string) {
    //防止请求过于频繁,影响设备控制 (Prevent requests from being too frequent and affecting device control)

    if (DeviceMapClass.deviceMap.has(deviceId)) {
        const device = DeviceMapClass.deviceMap.get(deviceId);

        if (device && device.deviceData.ip) {
            return;
        }

        logger.info('to query-----------------------', target);

        mdns.query({
            questions: [
                {
                    name: target,
                    type: 'A',
                },
            ],
        });
    }
}

/** 获取已搜索到的局域网设备 (Get the searched LAN devices)*/
function getMDnsDeviceList() {
    let arr: any = Array.from(DeviceMapClass.deviceMap.entries());
    arr = arr.map((item: any) => {
        return {
            deviceId: item[0],
            ...item[1],
        };
    });
    return arr as {
        deviceId: string;
        discoveryTime: number;
        deviceData: IMdnsParseRes;
    }[];
}

/** 根据设备id获取设备的局域网信息 (Obtain the LAN information of the device based on the device ID)*/
function getMDnsDeviceDataByDeviceId(deviceId: string) {
    const mDnsDeviceList = getMDnsDeviceList();
    const thisItem = mDnsDeviceList.find((item) => {
        return item.deviceId === deviceId;
    });
    if (!thisItem) {
        logger.error('can not find this device lan info-------------------------', deviceId);
        return null;
    }

    return thisItem;
}

/** 离线某个设备 (Take a device offline)*/
function setOfflineDevice(deviceId: string) {
    const deviceData = getMDnsDeviceDataByDeviceId(deviceId);
    if (!deviceData) return;
    deviceData.deviceData.isOnline = false;
    DeviceMapClass.deviceMap.set(deviceId, {
        discoveryTime: deviceData.discoveryTime,
        deviceData: deviceData.deviceData,
    });
}
export default {
    setOnline,
    setOffline,
    mDnsQueryA,
    getMDnsDeviceList,
    getMDnsDeviceDataByDeviceId,
    updateAData,
    setOfflineDevice,
};
