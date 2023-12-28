<script setup lang="ts">
import { useEtcStore } from '@/store/etc';
import { Modal, message } from 'ant-design-vue';
import i18n from '@/i18n';
import { useDeviceStore } from '@/store/device';
import { getAssetsFile } from '@/utils/tools';

const emits = defineEmits(['loginVisibleChange']);

const etcStore = useEtcStore();
const deviceStore = useDeviceStore();

const accountVisible = ref<boolean>(false);
const headerContainerRef = ref();
const isRefresh = ref<boolean>(false);

const version = import.meta.env.VITE_VERSION;

const handleConfirmLogout = () => {
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
        onCancel() {}
    });
}

const handleRefreshDevice = async () => {
    if (isRefresh.value) return;
    let res: any = '';
    isRefresh.value = true;
    // 刷新按钮旋转动画维持整数秒
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
};

const handleFilterDeviceList = () => {
    deviceStore.setIsFilter(!deviceStore.isFilter);
};

</script>

<template>
    <div class="header-container" ref="headerContainerRef">
        <div class="search-container">
            <img class="search-icon" :src="getAssetsFile('img/search-global.png')" alt="search">
            <div class="search-text">{{ $t('SEARCHING_CURRENT_LAN_DEVICE') }}</div>
            <i18n-t v-if="!etcStore.isLogin" class="search-text" keypath="PLEASE_LOGIN" tag="div">
                <template #LOGIN_EWELINK>
                    <span class="to-login" @click="emits('loginVisibleChange', true)">{{ $t('LOGIN_EWELINK') }}</span>
                </template>
            </i18n-t>
        </div>
        <a-popover
            trigger="click"
            :getPopupContainer="() => headerContainerRef"
            placement="bottomRight"
            @visibleChange="(visible: boolean) => accountVisible = visible"
        >
            <template #content>
                <div v-if="etcStore.isLogin" class="account">{{ etcStore.userInfo.account }}</div>
                <div v-else class="account not-login" @click="emits('loginVisibleChange', true)">{{ $t('LOGIN_EWELINK_ACCOUNT') + '>' }}</div>
                <div v-if="etcStore.isLogin" class="item" @click="handleRefreshDevice">
                    <img :src="getAssetsFile('img/refresh-gray.png')" class="refresh-img" :class="{ rotate : isRefresh }" alt="refresh">
                    <span class="text">{{ $t('UPDATE_DEVICE_LIST') }}</span>
                </div>
                <div v-if="etcStore.isLogin" class="item" @click="handleFilterDeviceList">
                    <img :src="deviceStore.isFilter ? getAssetsFile('img/view.png') : getAssetsFile('img/hide.png')" />
                    <span class="text">{{ deviceStore.isFilter ? $t('SHOW_DEVICES') : $t('HIDE_DEVICES') }}</span>
                </div>
                <div v-if="etcStore.isLogin" class="item" @click="handleConfirmLogout">
                    <img :src="getAssetsFile('img/exit.png')" alt="exit">
                    <span class="text">{{ $t('LOGOUT') }}</span>
                </div>
                <div class="item version">
                    version {{ version }}
                </div>
            </template>
            <div class="account-container">
                <img :src="getAssetsFile('img/user.png')" alt="account">
                <img class="select-img" :class="{ 'transform-rotate': accountVisible }" :src="getAssetsFile('img/select.png')" alt="select">
            </div>
        </a-popover>
    </div>
</template>

<style scoped lang="scss">
.header-container {
    display: flex;
    justify-content: space-between;
    .search-container {
        display: flex;
        align-items: center;
        .search-icon {
            width: 27px;
            height: 27px;
        }
        .search-text {
            color: #A1A1A1;
            font-size: 14px;
            font-weight: 500;
            margin-left: 8px;
            .to-login {
                color: #1890FF;
                cursor: pointer;
            }
        }
    }
    .account-container {
        cursor: pointer;
        .select-img {
            margin-left: 12px;
            transition: .3s transform ease-in-out;
            &.transform-rotate {
                transform: rotate(180deg);
            }
        }
    }
    &:deep(.ant-popover) {
        z-index: 999;
    }
    &:deep(.ant-popover-inner) {
        border-radius: 12px;
        min-width: 240px;
        .item {
            margin-top: 12px;
            cursor: pointer;
            .text {
                margin-left: 8px;
            }
            .refresh-img {
                &.rotate {
                    animation: rotate 1s linear infinite;
                    -webkit-animation: rotate 1s linear infinite; /* Safari and Chrome */
                }
            }
        }
        .account {
            color: #1890FF;
            font-size: 16px;
            font-weight: 500;
            &.not-login {
                cursor: pointer;
            }
        }
        .version {
            font-size: 14px;
            color: #999999;
            cursor: auto;
        }
    }

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

</style>