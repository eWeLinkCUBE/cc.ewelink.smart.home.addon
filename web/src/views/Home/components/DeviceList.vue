<template>
    <div>
        <Header @login-visible-change="(val: boolean) => loginVisible = val" />
        <div class="device-list" v-if="!etcStore.isLogin">
            <div class="list-container">
                <div v-for="lan in deviceStore.beforeLoginDeviceList" class="device-item">
                    <div class="item-top">
                        <img class="device-icon" src="@/assets/img/unlogin-device-icon.png" />
                        <div class="device-info">
                            <div class="device-name">{{ lan.deviceId }}</div>
                            <span class="bottom-context">{{ $t('THE_DEVICE_HAS') }}</span>
                        </div>
                    </div>
                    <div style="margin-top: 0px" class="item-bottom">

                    </div>
                </div>
            </div>
            <div v-if="deviceStore.beforeLoginDeviceList.length === 0" class="no-data">
                <searching-card @login-visible-change="(val: boolean) => loginVisible = val" />
            </div>
        </div>
        <div class="device-list" v-else>
            <div class="list-container">
                <div v-for="device in lanDeviceList" class="device-item" :class="{ offline: !device.isOnline }">
                    <DeviceCard
                        :device="device"
                        :sync-loading-list="syncLoadingList"
                        @push-sync-loading-list="(deviceId: string) => syncLoadingList.push(deviceId)"
                        @splice-sync-loading-list="({ index, count }) => syncLoadingList.splice(index, count)"
                    />
                </div>
            </div>
            <div class="list-container">
                <div v-for="device in wifiDeviceList" class="device-item" :class="{ offline: !device.isOnline }">
                    <DeviceCard
                        :device="device"
                        :sync-loading-list="syncLoadingList"
                        @push-sync-loading-list="(deviceId: string) => syncLoadingList.push(deviceId)"
                        @splice-sync-loading-list="({ index, count }) => syncLoadingList.splice(index, count)"
                    />
                </div>
            </div>
            <div v-if="deviceList.length === 0" class="no-data">
                <searching-card @login-visible-change="(val: boolean) => loginVisible = val" />
            </div>
        </div>
    </div>
    <LoginModal v-model:login-visible="loginVisible" />
    <GetAccessTokenModalVue v-model:getAccessTokenVisible="etcStore.getAccessTokenVisible" @setSyncLoadingList="setSyncLoadingList"></GetAccessTokenModalVue>
</template>

<script setup lang="ts">
import { useDeviceStore } from '@/store/device';
import { useEtcStore } from '@/store/etc';
import { message } from 'ant-design-vue';
import GetAccessTokenModalVue from './GetAccessTokenModal.vue';
import i18n from '@/i18n';
import SearchingCard from './SearchingCard.vue';
import LoginModal from './LoginModal.vue';
import Header from './Header.vue';
import DeviceCard from './DeviceCard.vue';
import ENetworkProtocol from '@/ts/enum/ENetworkProtocol';

const etcStore = useEtcStore();
const deviceStore = useDeviceStore();
const loginVisible = ref<boolean>(false);
const syncLoadingList = ref<string[]>([]);
// const getAccessTokenTimeNumber = ref<number>();
// const getAccessTokenNumber = ref<number>(0);
// const deviceList = ref<IAfterLoginDevice[]>();

interface ISetSyncLoadingList {
    type: 'add' | 'delete';
    deviceId: string;
}

const deviceList = computed(() => {
    if (deviceStore.isFilter) {
        return deviceStore.filterAfterLoginDeviceList;
    } else {
        return deviceStore.afterLoginDeviceList;
    }
});

const lanDeviceList = computed(() => deviceList.value.filter(item => item.networkProtocol === ENetworkProtocol.LAN));
const wifiDeviceList = computed(() => deviceList.value.filter(item => item.networkProtocol === ENetworkProtocol.WIFI));

onMounted(() => {
    // if (etcStore.isLogin) {
    //     deviceStore.getAfterLoginDeviceList();
    //     const afterInterval = setInterval(() => {
    //         deviceStore.getAfterLoginDeviceList();
    //     }, 10000);
    //     deviceStore.setAfterLoginDeviceListInterval(afterInterval);
    //     // api.setEventCallback(errorCallback);
    // } else {
    //     deviceStore.getBeforeLoginDeviceList();
    //     const beforeInterval = setInterval(() => {
    //         deviceStore.getBeforeLoginDeviceList();
    //     }, 10000);
    //     deviceStore.setBeforeLoginDeviceListInterval(beforeInterval);
    // }
});

const getDeviceListInfo = () => {
    if (etcStore.isLogin) {
        deviceStore.getAfterLoginDeviceList();
        const afterInterval = setInterval(() => {
            deviceStore.getAfterLoginDeviceList();
        }, 10000);
        deviceStore.setAfterLoginDeviceListInterval(afterInterval);
        // api.setEventCallback(errorCallback);
    } else {
        deviceStore.getBeforeLoginDeviceList();
        const beforeInterval = setInterval(() => {
            deviceStore.getBeforeLoginDeviceList();
        }, 10000);
        deviceStore.setBeforeLoginDeviceListInterval(beforeInterval);
    }
};

const setSyncLoadingList = (config: ISetSyncLoadingList) => {
    if (config.type === 'add') {
        syncLoadingList.value.push(config.deviceId);
    } else {
        const index = syncLoadingList.value.findIndex((item) => item === config.deviceId);
        syncLoadingList.value.splice(index, 1);
    }
};

const errorCallback = (data: any) => {
    if (data.error === 402 || data.error === 401) {
        dealErrorHandler();
    }
    if (data && data.error === 500) {
        message.error(i18n.global.t('LOGIN.RES_FAIL'));
    }
};

const dealErrorHandler = () => {
    message.error(i18n.global.t('AT_OVERDUE'));
    etcStore.atPastDue();
};

</script>

<style scoped lang="scss">
.device-list {
    .list-container {
        display: flex;
        gap: 16px 19px;
        flex-wrap: wrap;
        margin-top: 12px;
        .device-item {
            position: relative;
            padding: 16px;
            display: flex;
            flex-direction: column;
            width: 325px;
            height: 110px;
            box-shadow: 0px 0px 4px 0px rgba(185, 180, 180, 0.25);
            border-radius: 12px 12px 12px 12px;
            background: #ffffff;
            &.offline {
                background: rgba(177, 179, 192, 0.3);
                color: #888;
            }
            .item-top {
                display: flex;
                .device-icon {
                    height: 46px;
                    width: 46px;
                }
                .device-info {
                    margin-left: 8px;
                    height: 46px;
                    .device-name {
                        font-size: 18px;
                        font-weight: 600;
                        max-width: 250px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .bottom-context {
                        font-weight: 600;
                        color: #a1a1a1;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}

.no-data {
    display: flex;
    flex-direction: column;
}
</style>
