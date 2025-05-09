<template>
    <a-spin :spinning="etcStore.isLoading">
        <div class="content">
            <DeviceList />
        </div>
    </a-spin>
    <MaskLayer />
</template>

<script setup lang="ts">
import MaskLayer from './MaskLayer.vue';
import { useEtcStore } from '@/store/etc';
import DeviceList from './DeviceList.vue';
const etcStore = useEtcStore();
</script>

<style scoped lang="scss">
.content {
    padding: 16px;
    background-color: #ffffff;
    min-height: calc(100vh - 80px);
    // min-height: 450px;
    min-width: 1088px;
}

.ant-spin-nested-loading {
    z-index: 0;
}

:deep(.ant-spin-nested-loading > div > .ant-spin) {
    max-height: none !important;
}
</style>
