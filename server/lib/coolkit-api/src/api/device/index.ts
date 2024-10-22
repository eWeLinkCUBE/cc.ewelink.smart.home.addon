import { ApiResponse, MsgLang } from '../index';
import { getAt } from '../../store';
import { sendRequest } from '../../utils';

export interface DeviceSettings {
    opsNotify?: number;
    opsHistory?: number;
    alarmNotify?: number;
    wxAlarmNotify?: number;
    wxOpsNotify?: number;
    wxDoorbellNotify?: number;
    appDoorbellNotify?: number;
    doorOnNotify?: number;
    doorOffNotify?: number;
    wxDoorOffNotify?: number;
    wxDoorOnNotify?: number;
    removeNotify?: number;
    wxRemoveNotify?: number;
    moveNotify?: number;
    wxMoveNotify?: number;
    lightNotify?: number;
    wxLightNotify?: number;
    armOnNotify?: number;
    armOffNotify?: number;
    temperatureNotify?: number;
    minTemperature?: number;
    maxTemperature?: number;
    humidityNotify?: number;
    minHumidity?: number;
    maxHumidity?: number;
    webOpsNotify?: number;
}

export interface ShareItem {
    apikey: string;
    permit: number;
    phoneNumber?: string;
    email?: string;
    nickname?: string;
    comment?: string;
    shareTime?: number;
}

export interface FamilyItem {
    familyid: string;
    index: number;
    roomid?: string;
}

export interface DeviceListItem {
    name: string;
    deviceid: string;
    apikey: string;
    extra: any;
    brandName: string;
    brandLogo: string;
    showBrand: boolean;
    productModel: string;
    devGroups?: {
        type: number;
        groupId: string;
    }[];
    tags?: any;
    devConfig?: any;     // 官网只有摄像头的接口
    settings?: any;
    family: FamilyItem;
    sharedBy?: ShareItem;
    shareTo?: ShareItem[];
    devicekey: string;
    online: boolean;
    params?: any;
    gsmInfoData?: any;
}

export interface GroupListItem {
    id: string;
    name: string;
    mainDeviceId: string;
    family: FamilyItem;
    params: any;
}

// itemType 为 1 和 2 时
export interface DeviceListItemD {
    itemType: 1 | 2;
    itemData: DeviceListItem;
    index: number;
}

// itemType 为 3 时
export interface DeviceListItemG {
    itemType: 3;
    itemData: GroupListItem;
    index: number;
}

export const device = {
    /**
     * 获取 Thing 列表
     * @param params 请求参数
     */
    async getThingList(params?: {
        lang?: MsgLang;
        familyid?: string;
        num?: number;
        beginIndex?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            thingList: Array<DeviceListItemD | DeviceListItemG>;
            total: number;
        };
    }> {
        return await sendRequest('/v2/device/thing', 'GET', params ? params : {}, getAt());
    },

    /**
     * 获取指定 Thing 列表信息
     * @param params 请求参数
     */
    async getSpecThingList(params: {
        thingList: { itemType?: number; id: string }[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            thingList: Array<DeviceListItemD | DeviceListItemG>;
        };
    }> {
        return await sendRequest('/v2/device/thing', 'POST', params, getAt());
    },

    /**
     * 获取设备或群组的状态
     * @param params 请求参数
     */
    async getThingStatus(params: {
        type: 1 | 2;
        id: string;
        params?: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            params: any;
        };
    }> {
        return await sendRequest('/v2/device/thing/status', 'GET', params, getAt());
    },

    /**
     * 更新设备或群组的状态
     * @param params 请求参数
     */
    async updateThingStatus(params: { type: 1 | 2; id: string; params: any }): Promise<ApiResponse> {
        return await sendRequest('/v2/device/thing/status', 'POST', params, getAt());
    },

    /**
     * 批量更新设备或群组的状态
     * @param params 请求参数
     */
    async updateMultiThingStatus(params: {
        thingList: { type: 1 | 2; id: string; params: any }[];
        timeout?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            respList: {
                type: 1 | 2;
                id: string;
                error: number;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/thing/batch-status', 'POST', params, getAt());
    },

    /**
     * 添加 WiFi 设备
     * @param params 请求参数
     */
    async addWifiDevice(params: {
        name: string;
        deviceid: string;
        settings?: {
            opsNotify?: number;
            opsHistory?: number;
            alarmNotify?: number;
        };
        ifrCode?: string;
        digest: string;
        chipid?: string;
        familyid?: string;
        roomid?: string;
        sort?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            itemType: number;
            itemData: DeviceListItem;
            index: number;
        };
    }> {
        return await sendRequest('/v2/device/add', 'POST', params, getAt());
    },

    /**
     * 新增 GSM 设备
     * @param params 请求参数
     */
    async addGsmDevice(params: { id: string; name: string; familyid?: string; roomid?: string; sort?: number }): Promise<ApiResponse> {
        return await sendRequest('/v2/device/add-gsm', 'POST', params, getAt());
    },

    /**
     * 更新设备的名称／房间信息
     * @param params 请求参数
     */
    async updateDeviceInfo(params: { deviceid: string; name?: string; familyid?: string; roomid?: string }): Promise<ApiResponse> {
        return await sendRequest('/v2/device/update-info', 'POST', params, getAt());
    },

    /**
     * 删除设备
     * @param params 请求参数
     */
    async delDevice(params: { deviceid: string }): Promise<ApiResponse> {
        return await sendRequest(`/v2/device?deviceid=${params.deviceid}`, 'DELETE', null, getAt());
    },

    /**
     * 修改设备标签
     * @param params 请求参数
     */
    async updateDeviceTag(params: {
        deviceid: string;
        type?: 'replace' | 'merge';
        tags: any;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThing: any;
        };
    }> {
        return await sendRequest('/v2/device/tags', 'POST', params, getAt());
    },

    /**
     * 获取设备群组列表
     * @param params 请求参数
     */
    async getGroupList(params?: {
        lang?: MsgLang;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            groupList: {
                itemType: number;
                itemData: {
                    id: string;
                    name: string;
                    mainDeviceId: string;
                    family: FamilyItem;
                    params: any;
                };
                index: number;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/group', 'GET', params ? params : {}, getAt());
    },

    /**
     * 新增设备群组
     * @param params 请求参数
     */
    async addGroup(params: {
        name: string;
        mainDeviceId: string;
        familyid?: string;
        roomid?: string;
        sort?: number;
        deviceidList?: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            itemType: number;
            itemData: GroupListItem;
            index: number;
        };
    }> {
        return await sendRequest('/v2/device/group', 'POST', params, getAt());
    },

    /**
     * 修改设备群组
     * @param params 请求参数
     */
    async updateGroup(params: { id: string; name: string }): Promise<ApiResponse> {
        return await sendRequest('/v2/device/group', 'PUT', params, getAt());
    },

    /**
     * 删除设备群组
     * @param params 请求参数
     */
    async delGroup(params: { id: string }): Promise<ApiResponse> {
        return await sendRequest(`/v2/device/group?id=${params.id}`, 'DELETE', params, getAt());
    },

    /**
     * 更改群组状态
     * @param params 请求参数
     */
    async updateGroupStatus(params: { id: string; params: any }): Promise<ApiResponse> {
        return await sendRequest('/v2/device/group/status', 'POST', params, getAt());
    },

    /**
     * 获取设备的报警历史记录
     */
    async getAlarmHistory(params: {
        deviceid: string;
        type: string;
        from?: number;
        num?: number;
        rfChls?: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            alarmHistories: {
                request: string;
                opsTime: number;
                userAgent: string;
                rfChl?: number;
                opsSwitchs?: string[];
                opsAccount?: string;
                triggerType?: number;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/alarm-history', 'GET', params, getAt());
    },

    /**
     * 设备群组新增设备
     * @param params 请求参数
     */
    async addGroupDevice(params: {
        id: string;
        deviceidList: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }> {
        return await sendRequest('/v2/device/group/add', 'POST', params, getAt());
    },

    /**
     * 设备群组删除设备
     * @param params 请求参数
     */
    async delGroupDevice(params: {
        id: string;
        deviceidList: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }> {
        return await sendRequest('/v2/device/group/delete', 'POST', params, getAt());
    },

    /**
     * 更新设备群组的设备列表
     * @param params 请求参数
     */
    async updateGroupList(params: {
        id: string;
        deviceidList: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }> {
        return await sendRequest('/v2/device/group/update', 'POST', params, getAt());
    },

    /**
     * 分享设备
     * @param params 请求参数
     */
    async shareDevice(params: {
        deviceidList: string[];
        user: {
            countryCode?: string;
            phoneNumber?: string;
            email?: string;
        };
        permit: number;
        comment?: string;
        shareType?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }> {
        return await sendRequest('/v2/device/share', 'POST', params, getAt());
    },

    /**
     * 修改设备分享的权限
     * @param params 请求参数
     */
    async updateSharePermit(params: {
        deviceid: string;
        apikey: string;
        permit: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }> {
        return await sendRequest('/v2/device/share/permit', 'POST', params, getAt());
    },

    /**
     * 取消设备分享
     * @param params 请求参数
     */
    async cancelShare(params: {
        deviceid: string;
        apikey: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }> {
        return await sendRequest('/v2/device/share', 'DELETE', params, getAt());
    },

    /**
     * 获取设备的操作历史记录
     * @param params 请求参数
     */
    async getHistory(params: {
        deviceid: string;
        from?: number;
        num?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            histories: {
                deviceid: string;
                userAgent?: string;
                opsSwitchs?: string;
                request: string;
                opsAccount?: string;
                opsTime: number;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/history', 'GET', params, getAt());
    },

    /**
     * 清除设备的操作历史记录
     * @param params 请求参数
     */
    async delHistory(params: { deviceid: string }): Promise<ApiResponse> {
        return await sendRequest('/v2/device/history', 'DELETE', params, getAt());
    },

    /**
     * 查询设备的 OTA 信息
     * @param params 请求参数
     */
    async getOtaInfo(params: {
        deviceInfoList: {
            deviceid: string;
            model: string;
            version: string;
        }[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            otaInfoList: {
                deviceid: string;
                version: string;
                binList: {
                    name: string;
                    downloadUrl: string;
                    digest?: string;
                }[];
                type: string;
                forceTime: string;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/ota/query', 'POST', params, getAt());
    },

    /**
     * 新增第三方设备
     * @param params 请求参数
     */
    async addThirdPartyDevice(params: {
        accessToken?: string;
        puid?: string;
        partnerDevice: any[];
        type: number;
        familyid?: string;
        roomid?: string;
        sort?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            thingList: {
                itemType: number;
                itemData: DeviceListItem;
                index: number;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/inherit/add-partner-device', 'POST', params, getAt());
    },

    /**
     * 修改设备配置
     * @param params 请求参数
     */
    async updateDeviceSettings(params: {
        deviceidList: string[];
        settings: DeviceSettings;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        }
    }> {
        return await sendRequest('/v2/device/settings', 'POST', params, getAt());
    },

    /**
     * 获取设备使用情况
     */
    async getDeviceUsage(params: {
        deviceid: string;
        last: string;
        dateType: string;
        format?: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            temperature?: {
                hourly?: number[];
                daily?: {
                    min?: number;
                    max?: number;
                    avg?: number;
                }[];
                monthly?: {
                    min?: number;
                    max?: number;
                    avg?: number;
                }[];
            };
            humidity?: {
                hourly: number[];
                daily: {
                    min?: number;
                    max?: number;
                }[];
                monthly: {
                    min?: number;
                    max?: number;
                }[];
            };
            targetTemperature?: {
                hourly: number[];
                daily: {
                    avg?: number;
                }[];
                monthly: {
                    avg?: number;
                }[];
            };
            gasUsage?: {
                hourly: number[];
                daily: {
                    avg?: number;
                }[];
                monthly: {
                    avg?: number;
                }[];
            };
            hourlyData?: {
                date: string;
                time: string;
                temperature?: string;
                humidity?: string;
                targetTemperature?: string;
                gasUsage?: string;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/device-usage', 'GET', params, getAt());
    },

    /**
     * 获取设备温湿度历史数据
     */
    async getTempHumHistory(params: {
        deviceid: string;
        last: string;
        format?: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            tempHistory?: {
                hourly: number[];
                daily: {
                    min: number;
                    max: number;
                }[];
                monthly: {
                    min: number;
                    max: number;
                }[];
            };
            humHistory?: {
                hourly: number[];
                daily: {
                    min: number;
                    max: number;
                }[];
                monthly: {
                    min: number;
                    max: number;
                }[];
            };
            originalTempHumHistory: {
                date: string;
                time: string;
                temperature: string | number;
                humidity: string | number;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/temp-hum-history', 'GET', params, getAt());
    },

    /**
     * 查询 Matter 设备可达的 Hub 列表
     */
    async getMatterNodesReachableHubs(params: {
        deviceIds: string;
        includeOfflineHub?: boolean;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            hubs: {
                matterNodeId: string;
                deviceId: string;
                online: boolean;
                name: string;
                familyId: string;
                familyName: string;
                roomId?: string;
                roomName?: string;
            }[];
        };
    }> {
        return await sendRequest('/v2/device/matter/nodes/reachable-hubs', 'GET', params, getAt());
    }
};
