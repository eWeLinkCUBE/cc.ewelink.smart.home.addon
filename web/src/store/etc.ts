import { defineStore } from 'pinia';
import i18n from '@/i18n';
import type { IUser } from '@/ts/interface/IUser';
import api from '@/api';
import { useDeviceStore } from './device';
interface IEtcState {
    language: 'zh-cn' | 'en-us';
    /* 顶部卡片控制变量 (Top card control variables) */
    tipCardVisible: boolean;
    at: string;
    isLogin: boolean;
    userInfo: IUser;
    isLoading: boolean;
    getAccessTokenVisible: boolean;
    getAccessTokenTimeNumber: number;
    getAccessTokenNumber: number;
    getUserInfoInterval: number;
}

export const useEtcStore = defineStore('addon_etc', {
    state: (): IEtcState => {
        return {
            /** 国际化语言 (international language) */
            language: 'zh-cn',
            /** 是否显示提示卡片 (Whether to display reminder cards) */
            tipCardVisible: true,
            /** 登录凭证 (Login credentials) */
            at: '',
            /**  是否登录 (Log in or not) */
            isLogin: false,
            /** 用户信息 (User Info) */
            userInfo: {
                account: '',
                autoSyncStatus: false,
            },
            /** 控制context Loading变量 (Control context Loading variables) */
            isLoading: false,
            /** 控制获取凭证弹窗变量 (Control the variables of the pop-up window for obtaining credentials)*/
            getAccessTokenVisible: false,
            /** 轮询获取凭证接口返回值 (Polling to obtain the return value of the credential interface)*/
            getAccessTokenTimeNumber: 0,
            /**  获取凭证已轮询次数 (Get the number of times the voucher has been polled) */
            getAccessTokenNumber: 0,
            /** 获取登录信息轮询接口的返回值 (Get the return value of the login information polling interface)*/
            getUserInfoInterval: 0,
        };
    },
    getters: {},
    actions: {
        /** 修改国际化语言 (Modify internationalization language) */
        languageChange(language: 'zh-cn' | 'en-us') {
            this.language = language;
            i18n.global.locale = language;
        },
        setTipCardVisible(state: boolean) {
            this.tipCardVisible = state;
        },
        setAt(at: string) {
            this.at = at;
        },
        setLoginState(state: boolean) {
            this.isLogin = state;
        },
        setUserInfo(userInfo: IUser) {
            this.userInfo = userInfo;
        },
        setGetAccessTokenVisible(state: boolean) {
            this.getAccessTokenVisible = state;
        },
        setGetAccessTokenTimeNumber(num: number) {
            this.getAccessTokenTimeNumber = num;
        },
        setGetAccessTokenNumber(num: number) {
            this.getAccessTokenNumber = num;
        },
        setGetUserInfoInterval(num: number) {
            this.getUserInfoInterval = num;
        },
        atPastDue() {
            const deviceStore = useDeviceStore();
            clearInterval(deviceStore.afterLoginDeviceListInterval);
            clearInterval(this.getUserInfoInterval);
            return new Promise((resolve) => {
                setTimeout(() => {
                    window.localStorage.removeItem('addon_etc');
                    window.localStorage.removeItem('addon_device');
                    this.isLogin = false;
                    this.userInfo = {
                        account: '',
                        autoSyncStatus: false,
                    };
                    this.at = '';
                    location.reload();
                    resolve(1);
                }, 1500);
            });
        },
        async logOut() {
            const res = await api.smartHome.logOut();
            if (res.error === 0) {
                this.atPastDue();
            }
        },
        setAutoSyncStatus(state: boolean) {
            this.userInfo.autoSyncStatus = state;
        },
        setIsLoading(state: boolean) {
            this.isLoading = state;
        },
    },
    persist: true,
});
