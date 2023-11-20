import { MsgLang, ApiResponse } from '../index';
import { sendRequest, getDomainByCountryCode } from '../../utils';
import { getAt, getRt, setAt, setRt, setDomain } from '../../store';

export type RegionType = 'cn' | 'as' | 'us' | 'eu';

// 用户信息
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

function configDomain(code: string): boolean {
    const domain = getDomainByCountryCode(code);

    if (domain === '') {
        return false;
    } else {
        setDomain(domain);
        return true;
    }
}

export const user = {
    /**
     * 用户登录
     * @param params 请求参数
     */
    async login(params: { lang?: MsgLang; countryCode: string; email?: string; phoneNumber?: string; password: string }): Promise<CommonUserResponse> {
        if (!configDomain(params.countryCode)) {
            return {
                error: 91001,
                msg: '无效的国家码',
            };
        }

        const { error, msg, data } = await sendRequest('/v2/user/login', 'POST', params);

        if (error === 0) {
            // 登录成功后更新 Access Token 和 Refresh Token
            const { at, rt } = data;
            setAt(at);
            setRt(rt);
        }

        return {
            error,
            msg,
            data,
        };
    },

    /**
     * 用户退出登录
     */
    async logout(): Promise<ApiResponse> {
        const ret = await sendRequest('/v2/user/logout', 'DELETE', null, getAt());

        if (ret.error === 0) {
            // 退出登录清空 Access Token 和 Refresh Token
            setAt('');
            setRt('');
        }

        return ret;
    },

    /**
     * 修改密码
     * @param params 请求参数
     * @param at Access Token
     */
    async changePwd(params: { oldPassword: string; newPassword: string }): Promise<ApiResponse> {
        return await sendRequest('/v2/user/change-pwd', 'POST', params, getAt());
    },

    /**
     * 获取用户信息
     */
    async getProfile(): Promise<{
        error: number;
        msg: string;
        data: {
            user: UserInfo;
            region: RegionType;
        };
    }> {
        return await sendRequest('/v2/user/profile', 'GET', null, getAt());
    },

    /**
     * 更新用户信息
     * @param params 请求参数
     */
    async updateProfile(params: {
        nickname?: string;
        acceptEmailAd?: boolean;
        accountConsult?: boolean;
        mpUserData?: any;
        language?: string;
        lang?: string;
        setupIwatch?: boolean;
    }): Promise<ApiResponse> {
        return await sendRequest('/v2/user/profile', 'POST', params, getAt());
    },

    /**
     * 刷新 Token
     */
    async refresh(): Promise<{
        error: number;
        msg: string;
        data: {
            at: string;
            rt: string;
        };
    }> {
        const { error, msg, data } = await sendRequest('/v2/user/refresh', 'POST', { rt: getRt() }, getAt());

        if (error === 0) {
            // 更新 Access Token 和 Refresh Token
            const { at, rt } = data;
            setAt(at);
            setRt(rt);
        }

        return {
            error,
            msg,
            data,
        };
    },

    /**
     * 注册帐号
     * @param params 请求参数
     */
    async register(params: { countryCode: string; email?: string; phoneNumber?: string; verificationCode: string; password: string }): Promise<CommonUserResponse> {
        if (!configDomain(params.countryCode)) {
            return {
                error: 91001,
                msg: '无效的国家码',
            };
        }

        const { error, msg, data } = await sendRequest('/v2/user/register', 'POST', params);

        if (error === 0) {
            // 更新 Access Token 和 Refresh Token
            const { at, rt } = data;
            setAt(at);
            setRt(rt);
        }

        return {
            error,
            msg,
            data,
        };
    },

    /**
     * 发送验证码（邮箱不能用）
     * @param params 请求参数
     */
    async sendVerificationCode(params: { type: number /* 0 - 注册；1 - 重置密码；3 - 注销帐号；4 - 验证码登录 */; email?: string; phoneNumber?: string }): Promise<ApiResponse> {
        return await sendRequest('/v2/user/verification-code', 'POST', params);
    },

    /**
     * 使用短信验证码登录
     * @param params 请求参数
     */
    async smsLogin(params: { countryCode: string; lang?: MsgLang; phoneNumber: string; verificationCode: string }): Promise<CommonUserResponse> {
        if (!configDomain(params.countryCode)) {
            return {
                error: 91001,
                msg: '无效的国家码',
            };
        }

        const { error, msg, data } = await sendRequest('/v2/user/sms-login', 'POST', params);

        if (error === 0) {
            // 更新 Access Token 和 Refresh Token
            const { at, rt } = data;
            setAt(at);
            setRt(rt);
        }

        return {
            error,
            msg,
            data,
        };
    },

    /**
     * 重置密码
     * @param params 请求参数
     */
    async resetPwd(params: { email?: string; phoneNumber?: string; verificationCode: string; password: string }): Promise<CommonUserResponse> {
        const { error, msg, data } = await sendRequest('/v2/user/reset-pwd', 'POST', params);

        if (error === 0) {
            // 更新 Access Token 和 Refresh Token
            const { at, rt } = data;
            setAt(at);
            setRt(rt);
        }

        return {
            error,
            msg,
            data,
        };
    },

    /**
     * 注销账号
     * @param params 请求参数
     */
    async closeAccount(params: { verificationCode: string }): Promise<ApiResponse> {
        return await sendRequest('/v2/user/close-account', 'POST', params);
    },

    /**
     * 验证帐号密码
     * @param params 请求参数
     */
    async verifyAccount(params: {
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
    }> {
        return await sendRequest('/v2/user/user-verify', 'POST', params);
    },

    /**
     * 领取会员体验资格
     * @param params 请求参数
     */
    async trialMembership(params: { email?: string; phoneNumber?: string }) {
        return await sendRequest('/v2/user/trial-membership', 'POST', params);
    },

    /**
     * 获取二维码
     * @param params 请求参数
     */
    async getQrCode(params: {
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
    }> {
        return await sendRequest('/v2/user/qr-code', 'POST', params);
    },

    /**
     * 获取二维码状态
     */
    async getQrCodeStatus(params: { code: string }): Promise<{
        error: number;
        msg: string;
        data: {
            status: string;
            extra: {
                at?: string;
            };
        };
    }> {
        return await sendRequest('/v2/user/qr-code/status', 'POST', params);
    },

    /**
     * 获取 Cast 列表
     */
    async getCastList(): Promise<{
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
    }> {
        return await sendRequest('/v2/user/cast/list', 'GET', null, getAt());
    },

    /**
     * 添加一个 Cast
     */
    async addCast(params: {
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
    }) {
        return await sendRequest('/v2/user/cast', 'POST', params, getAt());
    },

    /**
     * Cast 端登录接口
     */
    async castLogin(params: { lang?: MsgLang; countryCode: string; email?: string; phoneNumber?: string; password: string }): Promise<{
        error: number;
        msg: string;
        data?: {
            user: UserInfo;
            at: string;
            rt: string;
            region: RegionType;
            clientId: string;
        };
    }> {
        if (!configDomain(params.countryCode)) {
            return {
                error: 91001,
                msg: '无效的国家码',
            };
        }

        const { error, msg, data } = await sendRequest('/v2/user/client/cast/login', 'POST', params);

        if (error === 0) {
            // 登录成功后更新 Access Token 和 Refresh Token
            const { at, rt } = data;
            setAt(at);
            setRt(rt);
        }

        return {
            error,
            msg,
            data,
        };
    },

    /**
     * 编辑 Cast
     */
    async editCast(params: {
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
    }) {
        return await sendRequest('/v2/user/cast', 'PUT', params, getAt());
    },

    /**
     * 删除 Cast
     */
    async removeCast(params: { id: string }) {
        return await sendRequest('/v2/user/cast', 'DELETE', params, getAt());
    },

    /**
     * 批量编辑 cast
     */
    async editMultiCast(
        params: {
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
        }[]
    ) {
        return await sendRequest('/v2/user/casts', 'PUT', params, getAt());
    },
};
