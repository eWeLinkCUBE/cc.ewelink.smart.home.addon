<template>
    <div>
        <div class="device-list" v-if="!etcStore.isLogin">
            <div v-for="lan in deviceStore.beforeLoginDeviceList" class="device-item">
                <div class="item-top">
                    <img class="device-icon" src="@/assets/img/unlogin-device-icon.png" />
                    <div class="device-info">
                        <div class="device-name">{{ lan.deviceId }}</div>
                    </div>
                </div>
                <div style="margin-top: 0px" class="item-bottom">
                    <span class="bottom-context">{{ $t('THE_DEVICE_HAS') }}</span>
                </div>
            </div>
            <div v-if="deviceStore.beforeLoginDeviceList.length === 0" class="no-data">
                <img src="@/assets/img/no-data.png" />
                <div>{{ $t('NO_DATA') }}</div>
            </div>
        </div>
        <div class="device-list" v-else>
            <div v-for="device in deviceList" class="device-item" :class="{ offline: !device.isOnline }">
                <div class="item-top">
                    <img class="device-icon" :src="getDeviceImg(device)" />
                    <div class="device-info">
                        <div class="device-name">{{ device.isMyAccount ? device.deviceName : device.deviceId }}</div>
                        <div v-if="device.isMyAccount" class="device-id">
                            {{ device.deviceId }} <span v-if="device.displayCategory === 'rfGateway'">{{ $t('REMOTE', { number: device.subDeviceNum }) }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="device.isMyAccount && device.isSupported" class="item-bottom">
                    <span class="bottom-context family-name">{{ device.familyName }}</span>
                    <div v-if="syncLoadingList.includes(device.deviceId)">
                        <img class="loading-icon" :src="device.isOnline ? getAssetsFile('img/loading.png') : getAssetsFile('img/loading-off.png')" />
                    </div>
                    <div v-else>
                        <!-- Zigbee-P 网关显示子设备数量，不能同步 ( The gateway displays the number of sub-devices and cannot be synchronized.)-->
                        <span v-if="device.displayCategory === EDisplayCategory.ZIGBEE_P">{{ `${$t('SUB_DEVICE')}: ${device.subDeviceNum}` }}</span>
                        <template v-else>
                            <a v-if="device.isSynced" @click="cancelSync(device.deviceId)" class="sync" style="color: #ff5c5b">{{ $t('CANCELING_SYNC') }}</a>
                            <a-popover v-else="device.isSynced" placement="top">
                                <template #content>
                                    <span>{{ $t('SYNC_TO_IHOST') }}</span>
                                </template>
                                <a class="sync" @click="syncDevcie(device.deviceId)">{{ $t('SYNC') }}</a>
                            </a-popover>
                        </template>
                    </div>
                </div>
                <div v-else class="item-bottom">
                    <div class="warning-bottom">
                        <img :src="!device.isMyAccount ? getAssetsFile('img/yellow-warning.png') : getAssetsFile('img/red-warning.png')" />
                        <span :style="!device.isMyAccount ? { color: '#FAAD14' } : { color: '#FF5C5B' }" class="bottom-context">{{
                            !device.isMyAccount ? $t('NOT_UNDER_YOUR_ACCOUNT') : $t('NOT_SUPPORTED')
                        }}</span>
                    </div>
                </div>
                <div class="sub-icon-box">
                    <!-- zigbee 设备角标 (Device badge)-->
                    <img
                        v-if="device.networkProtocol === 'zigbee'"
                        src="@/assets/img/zigbee-p-sub-icon.png"
                        height="24"
                        width="24"
                        alt="zigbee-p device"
                    />
                </div>
            </div>
            <div v-if="deviceList.length === 0" class="no-data">
                <img src="@/assets/img/no-data.png" />
                <div>{{ $t('NO_DATA') }}</div>
            </div>
        </div>
    </div>
    <GetAccessTokenModalVue v-model:getAccessTokenVisible="etcStore.getAccessTokenVisible" @setSyncLoadingList="setSyncLoadingList"></GetAccessTokenModalVue>
</template>

<script setup lang="ts">
import api from '@/api';
import { useDeviceStore } from '@/store/device';
import { useEtcStore } from '@/store/etc';
import { getAssetsFile } from '@/utils/tools';
import { message } from 'ant-design-vue';
import GetAccessTokenModalVue from './GetAccessTokenModal.vue';
import { getDeviceImg } from '@/utils/deviceUtils';
import i18n from '@/i18n';
import { EDisplayCategory } from '@/ts/enum/EDisplayCategory'

const etcStore = useEtcStore();
const deviceStore = useDeviceStore();
const getAccessTokenVisible = ref(false);
const syncLoadingList = ref<string[]>([]);
// const getAccessTokenTimeNumber = ref<number>();
// const getAccessTokenNumber = ref<number>(0);
// const deviceList = ref<IAfterLoginDevice[]>();

interface ISetSyncLoadingList {
    type: 'add' | 'delete';
    deviceId: string;
}
const isIframe = computed(() => {
    if (self.frameElement && self.frameElement.tagName == 'IFRAME') {
        return true;
    }
    if (window.frames.length != parent.frames.length) {
        return true;
    }
    if (self != top) {
        return true;
    }
    return false;
});
const deviceList = computed(() => {
    if (deviceStore.isFilter) {
        return deviceStore.filterAfterLoginDeviceList;
    } else {
        return deviceStore.afterLoginDeviceList;
    }
});

const isRfBridge = computed(() => {});
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

const syncDevcie = async (deviceId: string) => {
    syncLoadingList.value.push(deviceId);
    const res = await api.smartHome.syncSingleDevice(deviceId);
    const index = syncLoadingList.value.findIndex((item) => item === deviceId);
    if (res.error === 0) {
        await deviceStore.getAfterLoginDeviceList();
        message.success(i18n.global.t('SYNC_SUCCESS'));
    } else if (res.error === 1100) {
        deviceStore.setWaitSyncDeviceId(deviceId);
        // in iframe
        if (isIframe.value) {
            if (etcStore.getAccessTokenTimeNumber !== 0) {
                clearInterval(etcStore.getAccessTokenTimeNumber);
                etcStore.setGetAccessTokenNumber(0);
            }
            await getIhostAccessToken(deviceId, index);
            const getAccessTokenTimeNumber = setInterval(async () => {
                await getIhostAccessToken(deviceId, index);
            }, 10000);
            etcStore.setGetAccessTokenTimeNumber(getAccessTokenTimeNumber);
        } else {
            etcStore.setGetAccessTokenVisible(true);
        }
        // getAccessTokenVisible.value = true;
    }
    syncLoadingList.value.splice(index, 1);
};

const setSyncLoadingList = (config: ISetSyncLoadingList) => {
    if (config.type === 'add') {
        syncLoadingList.value.push(config.deviceId);
    } else {
        const index = syncLoadingList.value.findIndex((item) => item === config.deviceId);
        syncLoadingList.value.splice(index, 1);
    }
};
const cancelSync = async (deviceId: string) => {
    syncLoadingList.value.push(deviceId);
    const res = await api.smartHome.cancelSyncSingleDevice(deviceId);
    const index = syncLoadingList.value.findIndex((item) => item === deviceId);
    if (res.error === 0) {
        await deviceStore.getAfterLoginDeviceList();
        syncLoadingList.value.splice(index, 1);
        // message.success('同步成功');
    }
    syncLoadingList.value.splice(index, 1);
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

const getIhostAccessToken = async (deviceId: string, index: number) => {
    etcStore.setGetAccessTokenNumber(etcStore.getAccessTokenNumber + 1);
    const res = await api.smartHome.getIhostAccessToken();
    //  获取凭证成功或者获取凭证次数达到18次（3分钟）清除定时器
    //  The timer is cleared when the voucher is obtained successfully or the number of vouchers obtained reaches 18 times (3 minutes)
    if (res.error === 0 || etcStore.getAccessTokenNumber === 18) {
        clearInterval(etcStore.getAccessTokenTimeNumber);
        await deviceStore.getAfterLoginDeviceList();
        console.log('发送设备获取接口');
        const waitSyncDeviceInfo = deviceStore.afterLoginDeviceList.find((item) => {
            return item.deviceId === deviceId;
        });
        if (waitSyncDeviceInfo?.isSynced) {
            deviceStore.setWaitSyncDeviceId('');
        } else {
            if (res.error === 0) {
                await api.smartHome.syncSingleDevice(deviceId);
            }
        }
        syncLoadingList.value.splice(index, 1);
    }
};
</script>

<style scoped lang="scss">
.device-list {
    margin-top: 28px;
    display: flex;
    gap: 16px 19px;
    flex-wrap: wrap;
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
            .item-top {
                .device-icon {
                    filter: grayscale(100%);
                    opacity: 0.5;
                }
            }
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
                .device-id {
                    margin-top: -4px;
                    font-size: 14px;
                    color: #a1a1a1;
                }
            }
        }
        .item-bottom {
            margin-top: 8px;
            margin-left: 54px;
            display: flex;
            justify-content: space-between;
            .bottom-context {
                font-weight: 600;
                color: #a1a1a1;
                font-size: 14px;
            }
            .family-name {
                max-width: 112px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .sync {
                font-size: 14px;
            }
            img {
                margin-right: 8px;
            }
            .warning-bottom {
                display: flex;
                align-items: center;
                .bottom-context {
                    font-weight: 500;
                }
            }
        }
        .sub-icon-box {
            position: absolute;
            top: 8px;
            right: 8px;
        }
    }
}

.no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    div {
        font-size: 20px;
        margin-top: 44px;
        font-weight: bold;
        color: rgba(66, 66, 66, 0.5);
    }
}
.loading-icon {
    width: 16px;
    height: 16px;
    margin-bottom: 6px;
    animation: rotate 2s linear infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}
</style>
