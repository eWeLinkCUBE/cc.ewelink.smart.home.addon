import BaseDeviceOperate from "../baseDeviceOperate";
import EUiid from "../../../ts/enum/EUiid";
import _ from "lodash";
import logger from "../../../log";
import { getUiidOperateInstance } from "../../../utils/deviceOperateInstanceMange";
import deviceDataUtil from "../../../utils/deviceDataUtil";
import getEWeLinkDevice from "../../public/getEWeLinkDevice";
import zigbeePOnlineMap from "../../../ts/class/zigbeePOnlineMap";
import type ZigbeeDeviceOperate from "../zigbeeDeviceOperate";
import db from "../../../utils/db";
import { decode } from 'js-base64';
import updateLanDeviceData from "../../public/updateLanDeviceData";
import mDnsDataParse from "../../../utils/mDnsDataParse";

function sleep(second: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, second * 1000);
    });
}

/** 
 * zigbee-p 网关设备 
 * zigbee-p gateway device 
 * 网关类设备没有同步、控制设备、上报设备状态等相关功能
 * Gateway equipment does not have related functions such as synchronization, control equipment, reporting equipment status, etc.
 */
export default class Uiid168 extends BaseDeviceOperate {
    static uiid = EUiid.uiid_168;

    private get _eWeLinkZigbeePDeviceList() {
        return deviceDataUtil.getEWelinkZigbeeSubDeviceList(this._deviceId)
    }

    /** zigbee-p 网关的 deviceId */
    constructor(deviceId: string) {
        super(deviceId);
    }

    private _diffZigbeeSubDeviceAndEWelinkDevice(zigbeePSubDeviceList: string[]) {
        try {
            if (!this._eWeLinkZigbeePDeviceList || !zigbeePSubDeviceList) {
                return;
            }

            zigbeePSubDeviceList.forEach((deviceId) => {
                if (!this._eWeLinkZigbeePDeviceList!.includes(deviceId)) {
                    this.addZigbeeSubDevice(deviceId);
                }
            });

            this._eWeLinkZigbeePDeviceList.forEach(deviceId => {
                if (!zigbeePSubDeviceList.includes(deviceId)) {
                    const operateInstance = getUiidOperateInstance(deviceId) as ZigbeeDeviceOperate;
                    operateInstance?.cancelSyncZigbeeDeviceToIHostBySse();
                }
            });
        } catch (error: any) {
            logger.error('diffZigbeeSubDeviceAndEWelinkDevice code error---------------------', error);
            return null;
        }
    }

    /** 获取网关下所有子设备列表 */
    async getZigbeePAllDeviceList() {
        try {
            logger.info('to get zigbee-p all deviceList', this._deviceId);
    
            const eWeLinkDeviceData = deviceDataUtil.getEWeLinkDeviceDataByDeviceId(this._deviceId);
    
            if (!eWeLinkDeviceData) {
                throw new Error('no this deviceId in eWeLinkDeviceData');
            }
    
            const { devicekey, apikey } = eWeLinkDeviceData.itemData;
    
            let allZigbeePDevicesRes = await updateLanDeviceData.getAllDevices(this._deviceId, devicekey, apikey);
    
            //请求报错，重试一次
            if (!allZigbeePDevicesRes) {
                logger.info('request zigbeeP error,try request again---');
                await sleep(3);
                allZigbeePDevicesRes = await updateLanDeviceData.getAllDevices(this._deviceId, devicekey, apikey);
            }
    
            if (!allZigbeePDevicesRes || !allZigbeePDevicesRes.iv || !allZigbeePDevicesRes.data) {
                throw new Error('allZigbeePDevicesRes error');
            }
    
            const allZigbeeDevices = mDnsDataParse.decryptionData({ iv: mDnsDataParse.decryptionBase64(allZigbeePDevicesRes.iv), key: devicekey, data: allZigbeePDevicesRes.data });
    
            // logger.info('allZigbeeDevices----------------------', JSON.stringify(allZigbeeDevices, null, 2));
            return allZigbeeDevices as { deviceid: string; online: boolean; params: any }[];
        } catch (error: any) {
            logger.error('get zigbee-p all devices error---------------------------', error);
            return null;
        }
    }

    /** zigbee-p sse 建连之后，需要同步zigbee-p 子设备的上下线状态 */
    async syncZigbeeDeviceOnlineToIHost() {
        try {
            const allZigbeeDevices = await this.getZigbeePAllDeviceList();

            if (!allZigbeeDevices) {
                return;
            }
            //判断子设备与云端缓存的区别，是否需要同步和取消同步
            const allZigbeeDeviceIdList = allZigbeeDevices.map((item) => item.deviceid);
            this._diffZigbeeSubDeviceAndEWelinkDevice(allZigbeeDeviceIdList);

            for (const subDeviceInfo of allZigbeeDevices) {
                // 保存在线状态，用于smart-home的前端页面
                // Save online status for the front-end page of smart home
                zigbeePOnlineMap.zigbeePSubDevicesMap.set(subDeviceInfo.deviceid, subDeviceInfo.online);
                const operateInstance = getUiidOperateInstance(subDeviceInfo.deviceid);
                operateInstance?.syncDeviceOnlineToIHost(subDeviceInfo.online);
            }
        } catch (error: any) {
            logger.error('sync zigbee device online or offline code error----------------zigbee subDevice offline', error);
            return null;
        }
    }

    /** zigbee-p sse 重连次数超过五次时, 下线所有 zigbee-p 网关子设备 */
    toOfflineAllZigbeePDevices() {
        const iHostDeviceList = db.getDbValue('iHostDeviceList');

        if (!iHostDeviceList) {
            return;
        }

        const deviceIdList = iHostDeviceList.map((item) => {
            if (!item.tags?.deviceInfo) return null;
            const deviceInfo = JSON.parse(decode(item.tags?.deviceInfo));
            if (deviceInfo) {
                return { deviceId: deviceInfo.deviceId as string, parentId: deviceInfo?.parentId as string, online: item.online, serial_number: item.serial_number };
            }
            return null;
        });

        _.remove(deviceIdList, (item) => {
            if (item === null) {
                return true;
            }
            if (item.parentId === this._deviceId) {
                return false;
            }
            return true;
        });

        deviceIdList.forEach((item) => {
            if (!item) {
                return;
            }
            const operateInstance = getUiidOperateInstance(item.deviceId);
            operateInstance?.syncDeviceOnlineToIHost(false);

            logger.info('sync zigbee device online or offline---------------zigbeeP offline', item?.deviceId, false);
            // 保存在线状态，用于smart-home的前端页面
            // Save online status for the front-end page of smart home
            zigbeePOnlineMap.zigbeePSubDevicesMap.set(item.deviceId, false);
        });
    }

    /** 增加zigbee-p子设备到云端数据 */
    addZigbeeSubDevice(deviceId: string) {
        try {
            if (!this._eWeLinkZigbeePDeviceList) {
                logger.info('no zigbeeSubDeviceIdList--');
                return;
            }
            if (!this._eWeLinkZigbeePDeviceList.includes(deviceId)) {
                logger.info('to add subDevice to eweLink device data------ ');
                logger.info('get eWelink device----------', deviceId);

                getEWeLinkDevice(deviceId);
                getEWeLinkDevice(this._deviceId);
            }
        } catch (error) {
            logger.error('addZigbeeSubDevice code error-------', deviceId, error);
            return null;
        }
    }
}