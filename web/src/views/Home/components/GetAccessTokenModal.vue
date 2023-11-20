<template>
    <div ref="getAccessTokenRef">
        <a-modal
            :visible="getAccessTokenVisible && !isIframe"
            @cancel="cancelGetAccessTokenVisible"
            centered
            width="600px"
            :closable="false"
            :footer="null"
            :getContainer="() => getAccessTokenRef"
        >
            <div class="modal-body">
                <img src="@/assets/img/tip-icon.gif" />
                <div class="modal-context">
                    <div class="tip-title" style="text-align: center">{{ $t('GET_ACCESS_TOKEN_TIP_TITLE') }}</div>
                    <div class="tip-context">
                        <div>Step 1:</div>
                        <div class="flex1">{{ $t('GET_ACCESS_TOKEN_TIP1') }}</div>
                    </div>
                    <div class="tip-context" style="margin-top: 4px">
                        <div>Step 2:</div>
                        <div class="flex1">{{ $t('GET_ACCESS_TOKEN_TIP2') }}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a-button @click="cancelGetAccessTokenVisible">{{ $t('CANCEL') }}</a-button>
                    <a-button @click="finish" type="primary">{{ $t('FINISH') }}</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import api from '@/api';
import i18n from '@/i18n';
import { useDeviceStore } from '@/store/device';
import { useEtcStore } from '@/store/etc';
import { message } from 'ant-design-vue';
const deviceStore = useDeviceStore();
const etcStore = useEtcStore();
const getAccessTokenRef = ref();
const props = defineProps({
    getAccessTokenVisible: {
        type: Boolean,
        default: false,
    },
});
const getAccessTokenTimer = ref<number>();
const getAccessTokenNumber = ref<number>(0);

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
const bodyHeight = computed(() => {
    if (etcStore.language === 'en-us') {
        return '572px';
    } else {
        return '545px';
    }
});
watch(
    () => props.getAccessTokenVisible,
    (newValue, oldValue) => {
        if (newValue) {
            getIhostAccessToken();
        } else {
            clearInterval(getAccessTokenTimer.value);
        }
    }
);
watch(
    () => getAccessTokenNumber.value,
    (newValue, oldValue) => {
        if (newValue >= 18) {
            clearInterval(getAccessTokenTimer.value);
            getAccessTokenNumber.value = 0;
        }
    }
);
const finish = async () => {
    const res = await api.smartHome.getIhostAccessToken();
    if (res.error === 0) {

        deviceStore.getAfterLoginDeviceList();
        // console.log('发送设备获取接口')
        // cancelGetAccessTokenVisible();
        if (deviceStore.waitSyncDeviceId !== '') {
            const waitSyncDeviceInfo = deviceStore.afterLoginDeviceList.find((item) => {
                return item.deviceId === deviceStore.waitSyncDeviceId;
            });
            if (waitSyncDeviceInfo?.isSynced) {
                deviceStore.setWaitSyncDeviceId('');
            } else {
                emits('setSyncLoadingList', { type: 'add', deviceId: deviceStore.waitSyncDeviceId });
                const res = await api.smartHome.syncSingleDevice(deviceStore.waitSyncDeviceId);
                if (res.error === 0) {
                    deviceStore.setWaitSyncDeviceId('');
                    // await deviceStore.getAfterLoginDeviceList();
                }
                emits('setSyncLoadingList', { type: 'delete', deviceId: deviceStore.waitSyncDeviceId });
            }
        } else {
            const res = await api.smartHome.autoSyncAllDevice(!etcStore.userInfo.autoSyncStatus);
            if (res.error === 0) {
                etcStore.setAutoSyncStatus(!etcStore.userInfo.autoSyncStatus);
            }
        }
        etcStore.setGetAccessTokenVisible(false);
        // deviceStore.getAfterLoginDeviceList();
    } else if (res.error === 1100) {
        message.error(i18n.global.t('GET_TOKEN_ERROR'));
        getAccessTokenNumber.value = 0;
        getIhostAccessToken();
    }
};
const emits = defineEmits(['setSyncLoadingList']);

const getIhostAccessToken = () => {
    api.smartHome.getIhostAccessToken();
    getAccessTokenTimer.value = setInterval(async () => {
        getAccessTokenNumber.value++;
        const res = await api.smartHome.getIhostAccessToken();
        if (res.error === 0) {
            clearInterval(getAccessTokenTimer.value);
        }
    }, 10000);
};

const cancelGetAccessTokenVisible = () => {
    // emits('update:getAccessTokenVisible', false);
    emits('setSyncLoadingList', { type: 'delete', deviceId: deviceStore.waitSyncDeviceId });
    etcStore.setGetAccessTokenVisible(false);
    deviceStore.setWaitSyncDeviceId('');
};
</script>

<style scoped lang="scss">
.modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: v-bind(bodyHeight);
    .modal-context {
        font-size: 16px;
        font-weight: 600;
        margin: 14px 0 24px;
        // margin: 22px 0 40px;
        .tip-title {
            text-align: center;
            font-size: 18px;
            margin-bottom: 8px;
        }
        .tip-context {
            display: flex;
            :first-child {
                width: 55px;
            }
            .flex1 {
                flex: 1;
            }
        }
    }
    .modal-footer {
        display: flex;
        justify-content: center;
        gap: 58px;
    }
}

:deep(.ant-modal-content) {
    border-radius: 12px;
}
:deep(.ant-btn) {
    height: 40px;
    width: 120px;
}
</style>
