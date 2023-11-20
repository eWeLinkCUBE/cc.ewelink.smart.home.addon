<template>
    <div ref="eWeLinkLoginRef">
        <a-modal
            :visible="loginVisible"
            :maskClosable="isMaskClosable"
            :destroyOnClose="true"
            @cancel="cancelLoginVisible"
            :footer="null"
            :getContainer="() => eWeLinkLoginRef"
            centered
            :closable="false"
            width="510px"
        >
            <div v-if="!isDownLoad">
                <!-- <a-tabs :class="etcStore.language === 'en-us' ? 'en-tab' : ''" v-model:activeKey="activeKey">
                    <a-tab-pane key="1" :tab="$t('LOGIN_WITH_QRCODE')">
                        <div v-if="isOverdue" @click="refreshQrcode" class="overdue-tip">
                            <p>{{ $t('QRCODE_RXPIRED') }}</p>
                            <p>{{ $t('TAP_REFRESH') }}</p>
                        </div>
                        <div class="qr-code" :style="isOverdue ? { opacity: 0.3 } : {}" v-if="activeKey === '1'">
                            <a-spin size="large" :spinning="spinning">
                                <qrcode-vue v-if="qrcodeKey === ''" :value="'https://ewelink.cc/'" :size="228" level="H" />
                                <qrcode-vue v-else @click="refreshQrcode" :class="isOverdue ? 'pointer' : ''" :value="qrcodeKey" :size="228" level="H" />
                            </a-spin>
                            <span
                                >{{ $t('SCAN_QRCODE_VIA_EWELINK_APP') }}
                            </span>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" :tab="$t('LOGIN_WITH_PASSWORD')"> -->
                <!-- <div v-if="activeKey === '2'"> -->
                <div>
                    <div class="title">{{ $t('LOGIN_WITH_PASSWORD') }}</div>
                    <a-form class="form" :label-col="etcStore.language === 'zh-cn' ? labelColCN : labelColEN" :model="accountInfo">
                        <span>{{ $t('REGION') }}</span>
                        <a-form-item class="Select">
                            <img class="icon" src="@/assets/img/country.png" />
                            <a-select v-model:value="accountInfo.region" show-search dropdownClassName="Select">
                                <a-select-option v-for="item in regionMap" :value="item.label">{{ item.label }} </a-select-option>
                            </a-select>
                        </a-form-item>
                        <span>{{ $t('ACCOUNT') }}</span>
                        <a-form-item class="Input">
                            <a-input :placeholder="$t('ENTER_ACCOUNT')" v-model:value="accountInfo.account">
                                <template #prefix>
                                    <img src="@/assets/img/account.png" />
                                </template>
                            </a-input>
                        </a-form-item>
                        <span>{{ $t('PASSWORD') }}</span>
                        <a-form-item class="Input">
                            <a-input-password @keyup.enter.native="loginWithAccount" :placeholder="$t('ENTER_PASSWORD')" v-model:value="accountInfo.passWord">
                                <template #prefix>
                                    <img src="@/assets/img/password.png" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item>
                            <a-button :loading="loading" @click="loginWithAccount" type="primary">{{ $t('LOGIN') }}</a-button>
                        </a-form-item>
                    </a-form>
                </div>
                <!-- </a-tab-pane>
                </a-tabs> -->
            </div>
            <div class="download-app" v-else>
                <left-outlined class="back" @click="() => (isDownLoad = false)" />
                <div class="download">{{ $t('DOWNLOAD_QRCODE') }}</div>
                <img src="@/assets/img/Qr-code.png" class="eWeLink-img" />
            </div>
            <a v-if="!isDownLoad" style="margin: 0 auto" @click="downloadApp">{{ $t('DOWNLODA_APP') }} ></a>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import { computed } from '@vue/reactivity';
import { message } from 'ant-design-vue';
import { useEtcStore } from '@/store/etc';
import regionMapCN from '@/assets/regionMap/regionMap-cn';
import regionMapEN from '@/assets/regionMap/regionMap-en';
import i18n from '@/i18n';
import api from '@/api';
import { useDeviceStore } from '@/store/device';
const activeKey = ref('1');
const qrcoderStatusTimer = ref<any>();
const qrcodeKey = ref('');
const loading = ref(false);
const isDownLoad = ref(false);
const isOverdue = ref(false);
const isGetStatus = ref(true);
// 声明点击蒙层是否允许关闭
// Declares whether clicking on the mask is allowed to close
const isMaskClosable = ref(true);
interface IAccountInfoType {
    region: string;
    account: string;
    passWord: string;
}

const spinning = ref<boolean>(false);
onMounted(() => {});
const etcStore = useEtcStore();
const deviceStore = useDeviceStore();
const getLoginQrcodeKey = async () => {
    spinning.value = true;
    // const res = await api.bridge.bridgeLinkLoginQrcodeKey()
    // if (res.data && res.error === 0) {
    //     if (isOverdue.value) isOverdue.value = !isOverdue.value
    //     qrcodeKey.value = res.data.key
    //     spinning.value = false
    //     // 开启确认二维码状态定时器 (Turn on the timer to confirm the QR code status)
    //     qrcoderStatusTimer.value = setInterval(async () => {
    //         if (isGetStatus.value) {
    //             isGetStatus.value = false
    //             const res = await api.bridge.bridgeLinkLoginQrcodeStatus()
    //             if (res.data && res.error === 0) {
    //                 isGetStatus.value = true
    //                 switch (res.data.status) {
    //                     case 0:
    //                         // 成功 清除查询二维码状态定时器 (Successfully cleared query QR code status timer)
    //                         clearInterval(qrcoderStatusTimer.value);
    //                         message.success(i18n.global.t('BIND_SUCCESS'))
    //                         cancelEWeLinkBindingModal()
    //                         break;
    //                     case 1:
    //                         // 未扫码 (QR code not scanned)
    //                         break
    //                     // 登录失败 (Login failed)
    //                     case 2:
    //                         clearInterval(qrcoderStatusTimer.value);
    //                         cancelEWeLinkBindingModal()
    //                         message.error(i18n.global.t('BIND_FAIL')); break;
    //                     // 二维码超时 (QR code timeout)
    //                     case 3:

    //                         clearInterval(qrcoderStatusTimer.value);
    //                         isOverdue.value = true;
    //                         break;
    //                 }

    //             }
    //         }

    //     }, 2000)
    // } else {
    //     spinning.value = false
    //     message.warning(i18n.global.t('BRIDGE_LINKED'))
    // }
};

const accountInfo: IAccountInfoType = reactive({
    region: etcStore.language === 'zh-cn' ? '中国(+86)' : 'China(+86)',
    account: '',
    passWord: '',
});
const eWeLinkLoginRef = ref<Element>();
const props = defineProps({
    loginVisible: {
        type: Boolean,
        default: false,
    },
});

const downloadApp = () => {
    isDownLoad.value = true;
};

watch(
    () => props.loginVisible,
    async (newValue, oldValue) => {
        // 打开弹窗 (open pop-up window)
        if (newValue === true) {
            activeKey.value = '1';
            // await getLoginQrcodeKey();
        }
        // 关闭弹窗 (Close pop-up window)
        else {
            clearInterval(qrcoderStatusTimer.value);
        }
        if (etcStore.language === 'zh-cn') accountInfo.region = '中国(+86)';
        else accountInfo.region = 'China(+86)';
    }
);

const emits = defineEmits(['cancelLoginVisible', 'refreshLinkStatus', 'update:loginVisible']);

const cancelLoginVisible = () => {
    isDownLoad.value = false;
    accountInfo.region = '';
    accountInfo.account = '';
    accountInfo.passWord = '';
    emits('cancelLoginVisible');
    emits('refreshLinkStatus');
};

// 刷新二维码 (Refresh QR code)
const refreshQrcode = async () => {
    if (isOverdue.value) {
        await getLoginQrcodeKey();
    }
    return;
};

// 国家与国家码 (Country and country code)
const regionMap = computed(() => {
    let regionData = etcStore.language === 'zh-cn' ? regionMapCN : regionMapEN;
    let regionOpitons = regionData.map((item) => {
        const value = Object.keys(item)[0];

        return {
            value,
            label: `${item[value]}(${value})`,
        };
    });
    return regionOpitons;
});
const labelColCN = { style: { width: '80px' } };
const labelColEN = { style: { width: '120px' } };

// 使用账号密码登录 (Log in using account and password)
const loginWithAccount = async () => {

    accountInfo.account = accountInfo.account.trim()

    if (!accountInfo.account || !accountInfo.passWord) {
        return message.error(i18n.global.t('ENTER_PASSWORD_AND_ACCOUNT'));
    }

    // 手机号邮箱验证 (Mobile phone number and email verification)
    if (accountInfo.account.includes('@')) {
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (!regEmail.test(accountInfo.account)) {
            return message.error(i18n.global.t('INCORRECT_EMAIL_FORMAT'));
        }
    } else {
        const regMobile = /^[0-9]+.?[0-9]*$/;
        // !isNaN(parseFloat(accountInfo.account)) && isFinite(accountInfo.account)
        if (!regMobile.test(accountInfo.account)) {
            return message.error(i18n.global.t('INCORRECT_PHONE_FORMAT'));
        }
    }
    loading.value = true;
    isMaskClosable.value = false;
    const regex = /\((.+?)\)/g;
    const params = {
        account: accountInfo.account,
        password: accountInfo.passWord,
        countryCode: accountInfo.region.match(regex)![0].replace('(', '').replace(')', ''),
    };
    const res = await api.smartHome.loginWithAccount(params);

    if (res.data && res.error === 0) {
        api.init(res.data.at);
        etcStore.setUserInfo(res.data.userInfo);
        etcStore.setLoginState(true);
        clearInterval(deviceStore.beforeLoginDeviceListInterval);
        emits('update:loginVisible', false);
        isMaskClosable.value = true;
        loading.value = false;
        message.success(i18n.global.t('LOGIN_SUCCESS'));
        etcStore.setIsLoading(true);
        await deviceStore.getAfterLoginDeviceList();
        etcStore.setIsLoading(false);
        // const afterInterval = setInterval(() => {
        //     deviceStore.getAfterLoginDeviceList();
        // }, 10000);

        etcStore.setTipCardVisible(true);
        // deviceStore.setAfterLoginDeviceListInterval(afterInterval);
        // etcStore.getNewVersionInfo();
        // cancelEWeLinkBindingModal();
    } else {
        isMaskClosable.value = true;
        loading.value = false;
    }
};
</script>

<style scoped lang="scss">
.qr-code {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
        margin-top: 16px;
        font-size: 16px;
        color: rgba(36, 36, 36, 0.5);
        margin-bottom: 2px;
    }
}
.form {
    height: 325px;
    padding: 0 80px;
    span {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 8px;
    }
}
.pointer {
    cursor: pointer;
}
.icon {
    position: absolute;
    left: 12px;
    top: 10px;
    z-index: 1;
}
.overdue-tip {
    position: absolute;
    left: 50%;
    top: 54%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    z-index: 999;
    cursor: pointer;

    p {
        font-size: 24px !important;
        margin-bottom: 14px;
    }
}
.title {
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #ececec;
    margin-bottom: 34px;
}
.download-app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto 0;
    .download {
        width: 450px;
        text-align: center;
        font-size: 20px;
        font-weight: 500;
    }

    .back {
        cursor: pointer;
        font-size: 20px;
        position: absolute;
        left: 20px;
        top: 20px;
    }
    .eWeLink-img {
        height: 300px;
        width: 300px;
    }
}

:deep(.ant-tabs-tab) {
    font-size: 20px;
}

:deep(.ant-tabs-nav .ant-tabs-tab) {
    padding: 0 67px 16px 68px;
}

:deep(.ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar) {
    height: 4px;
}
:deep(.ant-modal-body) {
    display: flex;
    flex-direction: column;
    height: 516px !important;
    padding: 24px 12px !important;
}

:deep(.ant-form-item-label > label) {
    font-size: 24px;
    height: 100%;
}

:deep(.ant-form) {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
:deep(.ant-form-item) {
    margin-bottom: 18px;
}
:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 2px;
}

.Input {
    .ant-input {
        height: 40px;
        border-radius: 2px;
    }
}

.en-tab {
    &:deep(.ant-tabs-tab) {
        font-size: 16px;
    }

    &:deep(.ant-tabs-nav .ant-tabs-tab) {
        padding: 10px 13px;
    }
}

:deep(.ant-form-item-control-input-content) {
    display: flex;
    justify-content: center;
}

:deep(.ant-modal-content) {
    border-radius: 12px;
}

:deep(.ant-btn) {
    height: 40px;
    width: 208px;
    font-size: 16px;
    border-radius: 4px;
}
:deep(.ant-select) {
    line-height: 40px;
}
:deep(.ant-select-single.ant-select-show-arrow .ant-select-selection-item) {
    padding-left: 24px;
}
:deep(.ant-select-selection-search, .ant-select-selector, .ant-select-selection-item) {
    padding-left: 24px !important;
}
:deep(.ant-spin-nested-loading > div > .ant-spin-lg .ant-spin-dot) {
    margin-top: 100px;
}
</style>
