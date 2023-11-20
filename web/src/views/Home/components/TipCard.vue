<template>
    <div class="tip-card" v-if="etcStore.tipCardVisible">
        <img src="@/assets/img/tip-icon.png" />
        <div class="tip-context">
            <div class="main-context">{{$t('USE_EWELINK')}}</div>
            <div class="tip-tip">
                <img src="@/assets/img/warning-icon.png" />
                <span>{{$t('WHEN_ADD')}}</span>
            </div>
        </div>
        <close-outlined @click="()=>etcStore.setTipCardVisible(false)"  style="font-size: 32px" />
    </div>
</template>

<script setup lang="ts">
import { useEtcStore } from '@/store/etc';
import { CloseOutlined } from '@ant-design/icons-vue';

const etcStore = useEtcStore()
</script>

<style scoped lang="scss">
.tip-card {
    display: flex;
    background-color: #f7f8fc;
    height: 256px;
    box-shadow: 0px 4px 12px 0px #98acba;
    // width: 100%;
    // margin: 16px 32px;
    border-radius: 12px;
    padding: 16px 50px;
    min-width: 1024px;
    .tip-context {
        flex: 1;
        margin-left: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .main-context {
            width: 55%;
            font-weight: 600;
            font-size: 16px;
        }
        .tip-tip {
            display: flex;
            align-items: center;
            img {
                margin-right: 8px;
            }
            font-size: 16px;
            color: #b1b1b4;
        }
    }
}
</style>
