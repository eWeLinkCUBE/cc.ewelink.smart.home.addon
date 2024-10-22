import { getAt } from "../../store";
import { sendRequest } from "../../utils";
import { ApiResponse } from '../index';

export type SceneType = 'manual' | 'condition';

export interface SceneSimple {
    id: string;
}

export interface SceneComplex {
    id: string;
    name: string;
    familyid: string;
    index: number;
    sceneType: SceneType;
    condition?: any;
    operations: any[];
    optRanges?: any[];
    iconIndex?: number;
    notify?: boolean;
}

export const scene = {
    /**
     * 获取场景列表
     * @param params 请求参数
     */
    async getSceneList(params: {
        familyid?: string;
        manual?: { num?: number; beginIndex?: number; };
        condition?: { num?: number; beginIndex?: number; };
        iwatch?: boolean;
        associatedWebhook?: boolean;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            manualScenes: SceneComplex[];
            conditionScenes: SceneComplex[];
            iwatchScenes: SceneSimple[];
        };
    }> {
        return await sendRequest('/v2/smartscene2/list', 'POST', params, getAt());
    },

    /**
     * 新增场景
     * @param params 请求参数
     */
    async addScene(params: {
        name: string;
        familyid?: string;
        sort?: number;
        sceneType: SceneType;
        condition?: {
            type: 'and' | 'or';
            disable?: boolean;
            triggers: {
                triggerType: 'device' | 'timer' | 'sun';
                deviceInfo?: {
                    deviceid: string;
                    expression: string;
                };
                timerInfo?: {
                    type: 'oneShot' | 'dayOfWeek';
                    oneShotTimestamp?: number;
                    dayOfWeek?: {
                        days: number[];
                        hour: number;
                        minute: number;
                        zone: number;
                    };
                };
                sunInfo?: {
                    type: 'rise' | 'set';
                    location: string;
                    extraInfo: string;
                };
            }[];
        };
        operations: {
            actionType: string;
            deviceInfo?: {
                deviceid: string;
                params: any;
            };
            delayInfo?: {
                seconds: number;
            };
            sceneInfo?: {
                id: string;
                action: string;
            };
            localDeviceInfo?: {
                localType: string;
                deviceid: string;
                params: any;
            };
        }[];
        optRanges?: {
            name?: string;
            week: number[];
            startHour: number;
            startMin: number;
            endHour: number;
            endMin: number;
            zone: number;
            optTime: string;
        }[];
        iconIndex?: number;
        notify?: boolean;
        associatedWebhook?: boolean;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            id: string;
            index: number;
        };
    }> {
        return await sendRequest('/v2/smartscene2', 'POST', params, getAt());
    },

    /**
     * 修改场景
     * @param params 请求参数
     */
    async updateScene(params: {
        id: string;
        name?: string;
        sceneType?: SceneType;
        condition?: any;
        operations?: any[];
        optRanges?: any[];
        iconIndex?: number;
        notify?: boolean;
        associatedWebhook?: boolean;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            id: string;
            index: number;
        };
    }> {
        return await sendRequest('/v2/smartscene2', 'PUT', params, getAt());
    },

    /**
     * 获取指定场景
     * @param params 请求参数
     */
    async getSpecScene(params: {
        sceneIds: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            scenes: any[];
        };
    }> {
        return await sendRequest('/v2/smartscene2/thelist', 'POST', params, getAt());
    },

    /**
     * 删除场景
     * @param params 请求参数
     */
    async deleteScene(params: {
        id: string;
    }): Promise<ApiResponse> {
        return await sendRequest(`/v2/smartscene2?id=${params.id}`, 'DELETE', {}, getAt());
    },

    /**
     * 设置设备的功能场景
     */
    async setDeviceFeature(params: {
        deviceid: string;
        sceneId?: string;
        trigger?: any;
        operation?: any;
        optRanges?: any;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            sceneId: string;
            trigger: any;
            operation: any;
        };
    }> {
        return await sendRequest('/v2/smartscene2/device-feature', 'POST', params, getAt());
    },

    /**
     * 执行设备的功能场景
     */
    async execDeviceFeature(params: {
        sceneId: string;
        info: any;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            sceneId: string;
            trigger: any;
            operation: any;
        };
    }> {
        return await sendRequest('/v2/smartscene2/device-feature/execute', 'POST', params, getAt());
    },

    /**
     * 获取自身场景
     */
    async getMyScene(params: {
        page: number;
        size: number;
        versionTag: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            scenes: {
                id: string;
                name: string;
                familyid: string;
                familyName: string;
                index: number;
                sceneType: string;
                condition?: any;
                operations: any;
                iconIndex: number;
                showOnHomepage: boolean;
                notify: boolean;
                handlerType: string;
            }[];
        };
    }> {
        return await sendRequest('/v2/smartscene2/my-scene', 'POST', params, getAt());
    },

    /**
     * 获取场景执行记录列表
     */
    async getSceneHistoryList(params: {
        from?: number;
        num?: number;
        versionTag: string;
        associatedWebhook?: boolean;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            histories: {
                triggerType: string;
                operations: any[];
                ts: number;
                sceneName: string;
            }[];
        };
    }> {
        return await sendRequest('/v2/smartscene2/history-list', 'POST', params, getAt());
    },

    /**
     * 场景排序
     * @param params 请求参数
     */
    async sortScene(params: {
        familyid?: string;
        sceneType: SceneType;
        idList: string[];
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/smartscene2/sort', 'POST', params, getAt());
    },

    /**
     * 执行场景
     * @param params 请求参数
     */
    async execScene(params: {
        id: string;
        localDevice?: boolean;
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/smartscene2/execute', 'POST', params, getAt());
    },

    /**
     * 获取执行场景记录
     * @param params 请求参数
     */
    async getExecHistory(params: {
        id: string;
        from?: number;
        num?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            histories: {
                triggerType: 'manual' | 'condition' | 'scene';
                triggers?: any[];
                scene?: {
                    id: string;
                    name: string;
                };
                operations: {
                    actionType: 'device' | 'delay' | 'scene' | 'localDevice';
                    deviceInfo?: any;
                    delayInfo?: any;
                    sceneInfo?: any;
                    localDeviceInfo?: any;
                    error: number;
                    ts: number;
                }[];
                ts: number;
            }[];
        }
    }> {
        return await sendRequest('/v2/smartscene2/history', 'POST', params, getAt());
    },

    /**
     * 设置扩展的场景列表
     * @param params 请求参数
     */
    async extSceneList(params: {
        familyid?: string;
        extType: string;
        sceneList: any[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            id: string;
        };
    }> {
        return await sendRequest('/v2/smartscene2/ext-scene', 'POST', params, getAt());
    },

    /**
     * 获取 webhookUrl
     */
    async getWebhookUrl(): Promise<{
        error: number;
        msg: string;
        data: {
            webhookUrl: string;
        };
    }> {
        return await sendRequest('/v2/smartscene2/webhooks/url', 'GET', null, getAt());
    },


    /**
     * 设置webhookUrl和场景的绑定
     * @param params 请求参数
     */
    async setWebhookAndScene(params: {
        bindingList: {
            webhookUrl: string;
            sceneId?: string
        }[];
    }) {
        return await sendRequest('/v2/smartscene2/webhooks', 'POST', params, getAt());
    },

    /**
     * 获取webhookUrl和场景的绑定
     */
    async getWebhookAndScene(): Promise<{
        error: number;
        msg: string;
        data: {
            bindingList?: {
                webhookUrl: string;
                sceneId?: string
            }[];
        };
    }> {
       return await sendRequest('/v2/smartscene2/webhooks', 'GET', null, getAt());
    },

    /**
     * 执行webhook
     * @param params 请求参数
     */
    async executeWebhook(params:{
        id: string
    }) {
       return await sendRequest('/v2/smartscene2/webhooks/execute', 'GET', params, getAt());
    }
};
