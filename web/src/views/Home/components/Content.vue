<template>
    <a-spin :spinning="etcStore.isLoading">
        <div class="content">
            <!-- <TipCard /> -->
            <DeviceList />
        </div>
    </a-spin>
</template>

<script setup lang="ts">
import { useEtcStore } from '@/store/etc';
// import TipCard from './TipCard.vue';
import DeviceList from './DeviceList.vue';
const etcStore = useEtcStore();
</script>

<style scoped lang="scss">
.content {
    position: relative;
    padding: 16px 32px;
    background-color: #f7f8fc;
    min-height: calc(100vh - 80px);
    // min-height: 450px;
    min-width: 1088px;
}
:deep(.ant-spin-nested-loading > div > .ant-spin) {
    max-height: none !important;
}
</style>
