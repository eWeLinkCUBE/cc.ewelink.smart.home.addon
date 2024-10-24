import { ApiResponse, MsgLang } from '../index';
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
    devConfig?: any;
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
export interface DeviceListItemD {
    itemType: 1 | 2;
    itemData: DeviceListItem;
    index: number;
}
export interface DeviceListItemG {
    itemType: 3;
    itemData: GroupListItem;
    index: number;
}
export declare const device: {
    getThingList(params?: {
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
    }>;
    getSpecThingList(params: {
        thingList: {
            itemType?: number;
            id: string;
        }[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            thingList: Array<DeviceListItemD | DeviceListItemG>;
        };
    }>;
    getThingStatus(params: {
        type: 1 | 2;
        id: string;
        params?: string | undefined;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            params: any;
        };
    }>;
    updateThingStatus(params: {
        type: 1 | 2;
        id: string;
        params: any;
    }): Promise<ApiResponse>;
    updateMultiThingStatus(params: {
        thingList: {
            type: 1 | 2;
            id: string;
            params: any;
        }[];
        timeout?: number | undefined;
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
    }>;
    addWifiDevice(params: {
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
    }>;
    addGsmDevice(params: {
        id: string;
        name: string;
        familyid?: string;
        roomid?: string;
        sort?: number;
    }): Promise<ApiResponse>;
    updateDeviceInfo(params: {
        deviceid: string;
        name?: string;
        familyid?: string;
        roomid?: string;
    }): Promise<ApiResponse>;
    delDevice(params: {
        deviceid: string;
    }): Promise<ApiResponse>;
    updateDeviceTag(params: {
        deviceid: string;
        type?: 'replace' | 'merge';
        tags: any;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThing: any;
        };
    }>;
    getGroupList(params?: {
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
    }>;
    addGroup(params: {
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
    }>;
    updateGroup(params: {
        id: string;
        name: string;
    }): Promise<ApiResponse>;
    delGroup(params: {
        id: string;
    }): Promise<ApiResponse>;
    updateGroupStatus(params: {
        id: string;
        params: any;
    }): Promise<ApiResponse>;
    getAlarmHistory(params: {
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
    }>;
    addGroupDevice(params: {
        id: string;
        deviceidList: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }>;
    delGroupDevice(params: {
        id: string;
        deviceidList: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }>;
    updateGroupList(params: {
        id: string;
        deviceidList: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }>;
    shareDevice(params: {
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
    }>;
    updateSharePermit(params: {
        deviceid: string;
        apikey: string;
        permit: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }>;
    cancelShare(params: {
        deviceid: string;
        apikey: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }>;
    getHistory(params: {
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
    }>;
    delHistory(params: {
        deviceid: string;
    }): Promise<ApiResponse>;
    getOtaInfo(params: {
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
    }>;
    addThirdPartyDevice(params: {
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
    }>;
    updateDeviceSettings(params: {
        deviceidList: string[];
        settings: DeviceSettings;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            updatedThingList: any[];
        };
    }>;
    getDeviceUsage(params: {
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
    }>;
    getTempHumHistory(params: {
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
    }>;
    getMatterNodesReachableHubs(params: {
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
    }>;
};
