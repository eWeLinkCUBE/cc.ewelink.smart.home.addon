import { MsgLang, ApiResponse } from '../index';
export declare type RegionType = 'cn' | 'as' | 'us' | 'eu';
export interface UserInfo {
    countryCode?: string;
    phoneNumber?: string;
    email?: string;
    apikey: string;
    nickname?: string;
    wxServiceId?: string;
    wxAppId?: string;
    wxId?: string;
    wxOpenId?: string;
    yanKanYunInfo?: any;
    accountLevel: number;
    levelExpiredAt?: number;
    denyRecharge?: boolean;
    accountConsult?: boolean;
    ipCountry?: string;
}
export interface CommonUserResponse {
    error: number;
    msg: string;
    data?: {
        user: UserInfo;
        at: string;
        rt: string;
        region: RegionType;
    };
}
export declare const user: {
    login(params: {
        lang?: MsgLang;
        countryCode: string;
        email?: string;
        phoneNumber?: string;
        password: string;
    }): Promise<CommonUserResponse>;
    logout(): Promise<ApiResponse>;
    changePwd(params: {
        oldPassword: string;
        newPassword: string;
    }): Promise<ApiResponse>;
    getProfile(): Promise<{
        error: number;
        msg: string;
        data: {
            user: UserInfo;
            region: RegionType;
        };
    }>;
    updateProfile(params: {
        nickname?: string;
        acceptEmailAd?: boolean;
        accountConsult?: boolean;
        mpUserData?: any;
        language?: string;
        lang?: string;
        setupIwatch?: boolean;
    }): Promise<ApiResponse>;
    refresh(): Promise<{
        error: number;
        msg: string;
        data: {
            at: string;
            rt: string;
        };
    }>;
    register(params: {
        countryCode: string;
        email?: string;
        phoneNumber?: string;
        verificationCode: string;
        password: string;
    }): Promise<CommonUserResponse>;
    sendVerificationCode(params: {
        type: number;
        email?: string;
        phoneNumber?: string;
    }): Promise<ApiResponse>;
    smsLogin(params: {
        countryCode: string;
        lang?: MsgLang;
        phoneNumber: string;
        verificationCode: string;
    }): Promise<CommonUserResponse>;
    resetPwd(params: {
        email?: string;
        phoneNumber?: string;
        verificationCode: string;
        password: string;
    }): Promise<CommonUserResponse>;
    closeAccount(params: {
        verificationCode: string;
    }): Promise<ApiResponse>;
    verifyAccount(params: {
        email?: string;
        phoneNumber?: string;
        password: string;
        operation: number;
        extraInfo?: {
            sso?: string;
            sig?: string;
        };
    }): Promise<{
        error: number;
        msg: string;
        data: {
            redirectUrl?: string;
        };
    }>;
    trialMembership(params: {
        email?: string;
        phoneNumber?: string;
    }): Promise<ApiResponse>;
    getQrCode(params: {
        type: string;
        extra?: {
            oldCode?: string;
        };
    }): Promise<{
        error: number;
        msg: string;
        data: {
            code: string;
            region: string;
            status: string;
        };
    }>;
    getQrCodeStatus(params: {
        code: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            status: string;
            extra: {
                at?: string;
            };
        };
    }>;
    getCastList(): Promise<{
        error: number;
        msg: string;
        data: {
            _id: string;
            subject: {
                weather: {
                    geo: string;
                    cityId: string;
                    cityName: string;
                };
                calendar: boolean;
            };
            charts: string[];
            things: string[];
            scenes: string[];
            name: string;
            setting?: {
                backgroundColor: string;
            };
            index?: number;
            cameras?: string[];
            apikey: string;
            __v: number;
        }[];
    }>;
    addCast(params: {
        name: string;
        things?: string[];
        scenes?: string[];
        pinCode?: string;
        charts?: string[];
        subject: {
            calendar?: boolean;
            weather?: {
                geo: string;
                cityName?: string;
            };
        };
        setting?: {
            backgroundColor: string;
        };
        cameras?: string[];
        index?: number;
    }): Promise<ApiResponse>;
    castLogin(params: {
        lang?: MsgLang;
        countryCode: string;
        email?: string;
        phoneNumber?: string;
        password: string;
    }): Promise<{
        error: number;
        msg: string;
        data?: {
            user: UserInfo;
            at: string;
            rt: string;
            region: RegionType;
            clientId: string;
        } | undefined;
    }>;
    editCast(params: {
        id: string;
        name: string;
        things?: string[];
        scenes?: string[];
        pinCode?: string;
        charts?: string[];
        subject?: {
            calendar?: boolean;
            weather?: {
                geo: string;
                cityName: string;
            };
        };
        setting?: {
            backgroundColor: string;
        };
        cameras?: string[];
        index?: number;
    }): Promise<ApiResponse>;
    removeCast(params: {
        id: string;
    }): Promise<ApiResponse>;
    editMultiCast(params: {
        id: string;
        name?: string;
        things?: string[];
        scenes?: string[];
        pinCode?: string;
        charts?: string[];
        subject?: {
            calendar?: boolean;
            weather?: {
                geo: string;
                cityName: string;
            };
        };
        setting?: {
            backgroundColor: string;
        };
        cameras?: string[];
        index?: number;
    }[]): Promise<ApiResponse>;
};
