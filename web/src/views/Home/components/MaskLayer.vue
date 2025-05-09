<template>
    <div class="mask-layer" v-if="!etc.support">
        <div class="mask-content">
            <img class="mask-content-img" :src="getAssetsFile('img/exclamation-not-support.png')" alt="">
            {{ $t('VERSION_NOT_SUPPORTED') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEtcStore } from '@/store/etc';
import { getAssetsFile } from '@/utils/tools';

const etc = useEtcStore();
</script>

<style scoped lang="scss">
.mask-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .mask-content {
        font-size: 16px;
        margin: 0 265px 0 266px;
        color: #fff;
        text-align: center;
        line-height: 19px;

        .mask-content-img {
            margin-top: -3px;
            width: 16px;
            height: 16px;
        }
    }
}
</style>