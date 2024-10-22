import { ApiResponse } from '../index';
import { getAt, setDomain } from "../../store";
import { sendRequest } from '../../utils';

export interface CommonStatisticsParamsCameraApp {
    category: 'cameraApp';
    data: {
        type: string;
        deviceid: string;
        watchTime?: number;
        from: string;
    };
}

export interface CommonStatisticsParamsCameraDockerGateway {
    category: 'cameraDockerGateway';
    data: {
        from: string;
        type: string;
        deviceid: string;
        value: number;
    };
}

export interface CommonStatisticsParamsMembershipIAP {
    category: 'membershipIAP';
    data: {
        type: string;
    };
}

export interface CommonStatisticsParamsOtaUpgradeReminder {
    category: 'otaUpgradeReminder';
    data: {
        deviceid: string;
    };
}

export interface QuestionnaireData {
    questionId: number;
    title: string;
    content: string[];
}

export const other = {
    /**
     * 上传问卷
     * @param params 请求参数
     */
    async uploadQuestionnaire(params: {
        type: string;
        from: string;
        duration: number;
        data: QuestionnaireData[];
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/utils/upload-questionnaire', 'POST', params);
    },

    /**
     * 通用统计
     * @param params 请求参数
     */
    async commonStatistics(params: CommonStatisticsParamsCameraApp | CommonStatisticsParamsCameraDockerGateway | CommonStatisticsParamsMembershipIAP | CommonStatisticsParamsOtaUpgradeReminder) {
        return await sendRequest('/v2/utils/common-statistics', 'POST', params);
    },

    /**
     * 获取第三方平台需要的认证 Code
     * @param params 请求参数
     */
    async getThirdPlatformAuthCode(params: {
        platform: string;
        clientId: string;
        data: any;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            code?: string;
            expiredAt?: number;
            extra?: any;
        };
    }> {
        return await sendRequest('/v2/thirdparty/oauth-code', 'POST', params, getAt());
    },

    /**
     * 获取第三方设备状态
     */
    async getThirdpartyDevicesStatus(params: {
        thirdparty: string;
        deviceids: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            devices: {
                deviceid: string;
                online: boolean;
                params: any;
            }[];
        };
    }> {
        let ids = [];
        for (const id of params.deviceids) {
            ids.push(`"${id}"`);
        }
        return await sendRequest(`/v2/thirdparty/devices/status?thirdparty=${params.thirdparty}&deviceids=[${ids.join(',')}]`, 'GET', null, getAt());
    },

    // 获取上传文件到 S3 的预签名 URL
    async getUploadFileS3PreSignUrl(params: {
        from: string;
        type: string;
        data?: any;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            url: string;
            fields: {
                key: string;
                bucket: string;
                'X-Amz-Algorithm': string;
                'X-Amz-Credential': string;
                'X-Amz-Date': string;
                'X-Amz-Security-Token': string;
                Policy: string;
                'X-Amz-Signature': string;
            }
        }
    }> {
        return await sendRequest('/v2/utils/upload-s3', 'POST', params, getAt())
    },

    // 上报埋点数据
    async eventTracking(params: {
        events: any[];
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/utils/event-tracking', 'POST', params, getAt());
    },

    // 查询城市地理位置信息列表
    async getCity(params: {
        location: string;
        langTag: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            locations: {
                country: string;
                adm1: string;
                adm2: string;
                name: string;
                lat: string;
                lon: string;
            }[];
        }
    }> {
        return await sendRequest(`/v2/utils/city?location=${encodeURIComponent(params.location)}&langTag=${params.langTag}`, 'GET', null, getAt());
    },

    // 根据 cityId 查询天气
    async getCityInfo(params: {
        geo?: string;
        cityId?: string;
        days?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            cityId: string;
            timeZone: number;
            dst: number;
            dstChange: string;
            temperature: number;
            tempRange: string;
            weather: number;
            officialIcon: number | string;
            forecasts: {
                date: string;
                weather: number;
                officialIcon: number | string;
                tempRange: string;
            }[];
            lastUpdatedAt: number;
        };
    }> {
        let url = `/v2/utils/city-info?cityId=${params.cityId}`
        if (params.geo) {
            url += `&geo=${encodeURIComponent(params.geo)}`
        }
        if (params.days) {
            url += `&days=${params.days}`
        }
        return await sendRequest(url, 'GET', null, getAt())
    }
};
