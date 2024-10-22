import { getAt } from '../../store';
import { sendRequest } from '../../utils';

export const openPlatform = {
    // 获取认证信息
    async getAuthInfo(): Promise<{
        error: number;
        msg: string;
        data: {
            personal?: {
                name?: string;
                email?: string;
                phoneNumber?: string;
                identifyNumber?: string;
                job: string;
            },
            company?: {
                name: string;
                email: string;
                phoneNumber?: string;
                companyName?: string;
                unifiedSocialCreditCode?: string;
                legalPersonName?: string;
                companyType?: string;
                officialWebsite?: string;
                companyBusinessInsights: string;
                address: string;
                businessLicenseKeys?: {
                    url: string;
                    key: string;
                }[];
                postalCode?: string;
                fax?: string;
            },
            status: string;
            reason?: string;
        };
    }> {
        return await sendRequest('/v2/open-platform/authentication', 'GET', null, getAt());
    },

    // 申请认证
    async applyAuth(params: {
        personal?: {
            name?: string;
            email?: string;
            phoneNumber?: string;
            identifyNumber?: string;
            job: string;
        },
        company?: {
            name: string;
            email: string;
            phoneNumber?: string;
            companyName: string;
            unifiedSocialCreditCode?: string;
            legalPersonName?: string;
            companyType?: string;
            officialWebsite?: string;
            companyBusinessInsights: string;
            address: string;
            businessLicenseKeys?: string[];
            postalCode?: string;
            fax?: string;
        }
    }) {
        return await sendRequest('/v2/open-platform/authentication', 'POST', params, getAt());
    },

    // 创建应用
    async createApp(params: {
        name: string;
        description: string;
        redirectURL: string;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            appid: string;
            appSecret: string;
        };
    }> {
        return await sendRequest('/v2/open-platform/application', 'POST', params, getAt());
    },

    // 删除应用
    async removeApp(params: {
        appid: string;
    }) {
        return await sendRequest(`/v2/open-platform/application?appid=${params.appid}`, 'DELETE', null, getAt());
    },

    // 修改应用
    async updateApp(params: {
        appid: string;
        name: string;
        description: string;
        redirectURL: string;
    }) {
        return await sendRequest('/v2/open-platform/application', 'PUT', params, getAt());
    },

    // 获取应用列表
    async getAppList(): Promise<{
        error: number;
        msg: string;
        data: {
            applicationList: Array<{
                appid: string;
                appSecret: string;
                name: string;
                description: string;
                redirectURL: string;
                createdAt: string;
                expiredAt: string;
            }>;
            creatingList?: string[];
        };
    }> {
        return await sendRequest('/v2/open-platform/application', 'GET', null, getAt());
    }
};
