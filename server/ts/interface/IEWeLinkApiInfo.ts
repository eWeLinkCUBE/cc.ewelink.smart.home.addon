export default interface IEWeLinkApiInfo {
    at: string;
    rt: string;
    region: 'cn' | 'us' | 'eu' | 'as';
    userInfo: {
        account: string;
        autoSyncStatus: boolean;
    };
    user: UserInfo;
}

interface UserInfo {
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
