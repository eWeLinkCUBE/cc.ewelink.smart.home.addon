import { ApiResponse } from '../index';
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
export declare const other: {
    uploadQuestionnaire(params: {
        type: string;
        from: string;
        duration: number;
        data: QuestionnaireData[];
    }): Promise<ApiResponse>;
    commonStatistics(params: CommonStatisticsParamsCameraApp | CommonStatisticsParamsCameraDockerGateway | CommonStatisticsParamsMembershipIAP | CommonStatisticsParamsOtaUpgradeReminder): Promise<ApiResponse>;
    getThirdPlatformAuthCode(params: {
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
    }>;
    getThirdpartyDevicesStatus(params: {
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
    }>;
    getUploadFileS3PreSignUrl(params: {
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
            };
        };
    }>;
    eventTracking(params: {
        events: any[];
    }): Promise<ApiResponse>;
    getCity(params: {
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
        };
    }>;
    getCityInfo(params: {
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
    }>;
};
