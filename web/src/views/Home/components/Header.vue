<template>
    <div class="header">
        <div class="header-left">
            <img src="@/assets/img/logo.png" />
            <div>
                <!-- <span class="first-word">e</span> -->
                <span>eWeLink Smart Home</span>
                <div>
                    {{ `version ${version}` }}
                </div>
            </div>
        </div>
        <div class="header-right" ref="headerRightRef">
            <a-popover v-if="!isIframe" placement="bottom">
                <template #content>
                    <span>{{ $t('OPEN_IHOST_DEVICELIST') }}</span>
                </template>
                <img @click="goIhost" class="go-ihost-icon" v-if="etcStore.isLogin" src="@/assets/img/jump.png" />
            </a-popover>
            <a-popover v-if="etcStore.isLogin" :getPopupContainer="() => headerRightRef" overlayClassName="userInfo-popover" placement="bottomRight" trigger="click">
                <template #content>
                    <div class="drop-down-popover">
                        <div @click="filterDeviceList" class="drop-item">
                            <img :src="deviceStore.isFilter ? getAssetsFile('img/view.png') : getAssetsFile('img/hide.png')" />
                            <span>{{ deviceStore.isFilter ? $t('SHOW_DEVICES') : $t('HIDE_DEVICES') }}</span>
                        </div>
                        <!-- <div class="drop-item">
                            <img src="@/assets/img/refresh.png" />
                            <span>{{ $t('AUTOMATICALLY_SYNC') }}</span>
                            <a-switch :checked="etcStore.userInfo.autoSyncStatus" @click="handleAutoSync" style="margin-left: auto"></a-switch>
                        </div> -->
                        <div @click="showConfirm" class="drop-item">
                            <img src="@/assets/img/exit.png" />
                            <span>{{ $t('LOGOUT') }}</span>
                        </div>
                    </div>
                </template>
                <div @click="handleUser" class="user-info">
                    <img src="@/assets/img/user.png" />
                    <a v-if="etcStore.isLogin" style="margin: 0 12px 0 8px" @click="login">{{ etcStore.userInfo.account }}</a>
                    <img src="@/assets/img/select.png" />
                </div>
            </a-popover>
            <a-popover v-if="etcStore.isLogin">
                <template #content>
                    <span>{{ $t('UPDATE_DEVICE_LIST') }}</span>
                </template>
                <img @click="updateDeviceList" :class="isRefresh ? 'rotate' : ''" class="refresh-device-list" src="@/assets/img/header-refresh.png" />
            </a-popover>
            <div v-if="!etcStore.isLogin" @click="handleUser" class="user-info">
                <img src="@/assets/img/user.png" />
                <a style="margin: 0 12px 0 8px" @click="login">{{ $t('LOGIN') }}</a>
                <img src="@/assets/img/select.png" />
            </div>
        </div>
    </div>
    <LoginModal v-model:login-visible="loginVisible" @cancelLoginVisible="loginVisible = false" />
</template>

<script setup lang="ts">
import { useEtcStore } from '@/store/etc';
import { useDeviceStore } from '@/store/device';
import LoginModal from './LoginModal.vue';
import { message, Modal } from 'ant-design-vue';
import { getAssetsFile } from '@/utils/tools';
import i18n from '@/i18n';
import api from '@/api';
const etcStore = useEtcStore();
const deviceStore = useDeviceStore();
const isAutoSync = ref(false);
const login = () => {};
const loginVisible = ref(false);
const headerRightRef = ref();
const handleUser = () => {
    if (!etcStore.isLogin) {
        loginVisible.value = true;
    } else {
        showDrop.value = !showDrop.value;
    }
};

watch(
    () => etcStore.isLogin,
    (newValue, oldValue) => {
        if (newValue && loginVisible) {
            loginVisible.value = false;
        }
    }
);

const version = import.meta.env.VITE_VERSION;
const showDrop = ref(false);
const showConfirm = () => {
    Modal.confirm({
        title: i18n.global.t('LOGOUT'),
        content: i18n.global.t('SURE_WANT_TO_QUIT'),
        okText: i18n.global.t('CONFIRM'),
        cancelText: i18n.global.t('CANCEL'),
        centered: true,
        wrapClassName: 'test',
        async onOk() {
            await etcStore.logOut();
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
    });
};

const filterDeviceList = () => {
    deviceStore.setIsFilter(!deviceStore.isFilter);
};

const handleAutoSync = async () => {
    const res = await api.smartHome.autoSyncAllDevice(!etcStore.userInfo.autoSyncStatus);
    if (res.error === 0) {
        etcStore.setAutoSyncStatus(!etcStore.userInfo.autoSyncStatus);
    } else if (res.error === 1100) {
        // 在iframe中
        if (isIframe.value) {
            if (etcStore.getAccessTokenTimeNumber !== 0) {
                clearInterval(etcStore.getAccessTokenTimeNumber);
                etcStore.setGetAccessTokenNumber(0);
            }
            getIhostAccessToken();
            const getAccessTokenTimeNumber = setInterval(async () => {
                getIhostAccessToken();
            }, 10000);
            etcStore.setGetAccessTokenTimeNumber(getAccessTokenTimeNumber);
        } else {
            etcStore.setGetAccessTokenVisible(true);
        }
    }
};

const updateDeviceList = async () => {
    if (isRefresh.value) return;
    let res: any = '';
    isRefresh.value = true;
    const refreshNumber = setInterval(() => {
        if (res) {
            clearInterval(refreshNumber);
            isRefresh.value = false;
        }
    }, 1000);
    res = await deviceStore.getAfterLoginDeviceList(true);
    if (res.error === 0) {
        message.success(i18n.global.t('REFRESH_SUCCESS'));
    }
    // if (res.error === 0) {
    //     isRefresh.value = false;
    // }
};

const goIhost = () => {
    window.open('http://ihost.local', '_blank');
};

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

const getIhostAccessToken = async () => {
    etcStore.setGetAccessTokenNumber(etcStore.getAccessTokenNumber++);
    const res = await api.smartHome.getIhostAccessToken();
    // 获取凭证成功或者获取凭证次数达到18次（3分钟）清除定时器
    // The timer is cleared when the voucher is obtained successfully or the number of vouchers obtained reaches 18 times (3 minutes)
    if (res.error === 0 || etcStore.getAccessTokenNumber === 18) {
        clearInterval(etcStore.getAccessTokenTimeNumber);
        if (res.error === 0) {
            const res = await api.smartHome.autoSyncAllDevice(!etcStore.userInfo.autoSyncStatus);
            if (res.error === 0) {
                etcStore.setAutoSyncStatus(!etcStore.userInfo.autoSyncStatus);
            }
        }
    }
};

const isRefresh = ref(false);

const isRotate = computed(() => {
    if (isRefresh.value) {
        return 'rotate 5s linear infinite';
    } else {
        return 'none';
    }
});
</script>

<style scoped lang="scss">
.header {
    background-color: #fff;
    height: 80px;
    display: flex;
    justify-content: space-between;
    padding: 11px 68px 11px 48px;
    min-width: 1024px;
    .header-left {
        display: flex;
        align-items: center;
        img {
            margin-right: 20px;
        }
        span {
            font-size: 30px;
            font-weight: bold;
        }
        div {
            font-size: 16px;
            font-weight: 600;
            margin-top: -6px;
        }
        .first-word {
            color: #ef961d;
        }
    }
    .header-right {
        display: flex;
        align-items: center;
        .user-info {
            display: flex;
            align-items: center;
            margin: 0 24px;
            cursor: pointer;
        }
        .go-ihost-icon {
            cursor: pointer;
        }
        .drop-down-popover {
            display: flex;
            flex-direction: column;
            height: 100%;
            .drop-item {
                cursor: pointer;
                display: flex;
                align-items: center;
                flex: 1;
                img {
                    margin-right: 11px;
                }
                span {
                    font-size: 16px;
                }
            }
        }
        .refresh-device-list {
            cursor: pointer;
            // animation: v-bind(isRotate);
            // animation: rotate 3s linear infinite;
            // -webkit-animation: rotate 3s linear infinite; /* Safari and Chrome */
        }
    }
}

.rotate {
    animation: rotate 1s linear infinite;
    -webkit-animation: rotate 1s linear infinite; /* Safari and Chrome */
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes rotate {
    /* Safari and Chrome */
    100% {
        transform: rotate(360deg);
    }
}
:deep(.userInfo-popover .ant-popover-inner) {
    width: 310px;
    // 屏蔽自动同步之前的高度 (Block height before automatic synchronization)
    // height:177px;
    height: 126px;
    border-radius: 12px;
}
:deep(.ant-popover) {
    z-index: 999;
}
:deep(.userInfo-popover .ant-popover-inner-content) {
    height: 100%;
}
:deep(.ant-modal-content) {
    border-radius: 12px !important;
}
</style>
