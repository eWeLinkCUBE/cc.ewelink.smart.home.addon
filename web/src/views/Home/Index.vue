<template>
    <Header />
    <Content />
</template>

<script setup lang="ts">
import Header from '@/views/Home/components/Header.vue';
import Content from '@/views/Home/components/Content.vue';
import { useEtcStore } from '@/store/etc';
import { message } from 'ant-design-vue';
import i18n from '@/i18n';
import api from '@/api';
import { useDeviceStore } from '@/store/device';
const etcStore = useEtcStore();
const deviceStore = useDeviceStore();

onMounted(async () => {
    // 语言跟随浏览器 (Language follows browser)
    // const browserLanguage = navigator.language;

    let browserLanguage = window.location.search;

    if(!browserLanguage){
        browserLanguage = navigator.language;
    }

    if (browserLanguage.includes('zh')) {
        // etcStore.languageChange('en-us');
        etcStore.languageChange('zh-cn');
    } else {
        etcStore.languageChange('en-us');
    }
    console.log(etcStore.language,'当前语言'); // Current language

    await getUserInfo();
    getDeviceListInfo();
    const getUserInfoInterval = setInterval(async () => getUserInfo(), 10000);
    etcStore.setGetUserInfoInterval(getUserInfoInterval);
});

const getUserInfo = async () => {
    const res = await api.smartHome.getLoginStatus();
    if (res.data && res.error === 0) {
        if (res.data.loginStatus === 2) {
            const etcStore = useEtcStore();
            const deviceStore = useDeviceStore();
            etcStore.setUserInfo(res.data.userInfo);
            etcStore.setAt(res.data.at);
            etcStore.setLoginState(true);
            // deviceStore.getAfterLoginDeviceList();
            // if (deviceStore.beforeLoginDeviceListInterval !== 0) {
            //     clearInterval(deviceStore.beforeLoginDeviceListInterval);
            // }
            // if (deviceStore.afterLoginDeviceListInterval === 0) {
            //     const afterInterval = setInterval(() => {
            //         deviceStore.getAfterLoginDeviceList();
            //     }, 10000);
            //     deviceStore.setAfterLoginDeviceListInterval(afterInterval);
            // }
            return;
        } else if (res.data.loginStatus === 1 && etcStore.isLogin) {
            message.error(i18n.global.t('AT_OVERDUE'));
            etcStore.atPastDue();
        } else {
            etcStore.setLoginState(false);
        }
    }
};

watch(
    () => etcStore.isLogin,
    (newValue, oldValue) => {
        clearGetDeviceListInterval()
        if (newValue) {
            getAfterLoginDeviceList();
        } else {
            getBeforeLoginDeviceList();
        }
    }
);

const clearGetDeviceListInterval = () => {
    if (deviceStore.beforeLoginDeviceListInterval !== 0) {
        clearInterval(deviceStore.beforeLoginDeviceListInterval);
    }
    if (deviceStore.afterLoginDeviceListInterval !== 0) {
        clearInterval(deviceStore.afterLoginDeviceListInterval);
    }
};

const getDeviceListInfo = () => {
    clearGetDeviceListInterval()
    if (etcStore.isLogin) {
        getAfterLoginDeviceList();
        // api.setEventCallback(errorCallback);
    } else {
        getBeforeLoginDeviceList();
    }
};

const getAfterLoginDeviceList = () => {
    deviceStore.getAfterLoginDeviceList();
    const afterInterval = setInterval(() => {
        deviceStore.getAfterLoginDeviceList();
    }, 10000);
    deviceStore.setAfterLoginDeviceListInterval(afterInterval);
};

const getBeforeLoginDeviceList = () => {
    deviceStore.getBeforeLoginDeviceList();
    const beforeInterval = setInterval(() => {
        deviceStore.getBeforeLoginDeviceList();
    }, 10000);
    deviceStore.setBeforeLoginDeviceListInterval(beforeInterval);
};
</script>

<style scoped lang="scss"></style>
