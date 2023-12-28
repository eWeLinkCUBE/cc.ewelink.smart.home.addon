<script setup lang="ts">
import type { IAfterLoginDevice } from '@/ts/interface/IDevice';
import { getDeviceImg } from '@/utils/deviceUtils';
import { getAssetsFile } from '@/utils/tools';
import { EDisplayCategory } from '@/ts/enum/EDisplayCategory'
import api from '@/api';
import { message } from 'ant-design-vue';
import { useDeviceStore } from '@/store/device';
import i18n from '@/i18n';
import { useEtcStore } from '@/store/etc';
import NetworkProtocol from './NetworkProtocol.vue';
import _ from 'lodash';

const deviceStore = useDeviceStore();
const etcStore = useEtcStore();

const props = defineProps<{
    device: IAfterLoginDevice,
    syncLoadingList: Array<string>
}>();

const emits = defineEmits(['pushSyncLoadingList', 'spliceSyncLoadingList']);

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

const cancelSync = async (deviceId: string) => {
    emits('pushSyncLoadingList', deviceId);
    const res = await api.smartHome.cancelSyncSingleDevice(deviceId);
    const index = props.syncLoadingList.findIndex((item) => item === deviceId);
    if (res.error === 0) {
        await deviceStore.getAfterLoginDeviceList();
    }
    emits('spliceSyncLoadingList', {
        index,
        count: 1
    });
};

const syncDevice = async (deviceId: string) => {
    emits('pushSyncLoadingList', deviceId);
    const res = await api.smartHome.syncSingleDevice(deviceId);
    const index = props.syncLoadingList.findIndex((item) => item === deviceId);
    if (res.error === 0) {
        await deviceStore.getAfterLoginDeviceList();
        message.success(i18n.global.t('SYNC_SUCCESS'));
    } else if (res.error === 1100) {
        deviceStore.setWaitSyncDeviceId(deviceId);
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
    }
    emits('spliceSyncLoadingList', {
        index,
        count: 1
    });
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
        emits('spliceSyncLoadingList', {
            index,
            count: 1
        });
    }
};

</script>

<template>
    <div class="item-top">
        <img class="device-icon" :class="{ offline: !device.isOnline }" :src="getDeviceImg(device)" />
        <div class="device-info">
            <div class="device-name">{{ device.isMyAccount ? device.deviceName : device.deviceId }}</div>
            <div v-if="device.isMyAccount" class="device-id">
                {{ device.deviceId }}
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
            <span v-else-if="device.displayCategory === EDisplayCategory.RF_GATEWAY">{{ $t('REMOTE', { number: device.subDeviceNum }) }}</span>
            <template v-else>
                <a v-if="device.isSynced" @click="cancelSync(device.deviceId)" class="sync" style="color: #ff5c5b">{{ $t('CANCELING_SYNC') }}</a>
                <a-popover v-else="device.isSynced" placement="top">
                    <template #content>
                        <span>{{ $t('SYNC_TO_IHOST') }}</span>
                    </template>
                    <a class="sync" @click="syncDevice(device.deviceId)">{{ $t('SYNC') }}</a>
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
        <network-protocol :device="device" />
    </div>
</template>

<style scoped lang="scss">

.item-top {
    display: flex;
    .device-icon {
        height: 46px;
        width: 46px;
        &.offline {
            filter: grayscale(100%);
            opacity: 0.5;
        }
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