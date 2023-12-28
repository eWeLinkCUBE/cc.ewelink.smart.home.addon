<script setup lang="ts">
import type { IAfterLoginDevice } from '@/ts/interface/IDevice';
import ENetworkProtocol from '@/ts/enum/ENetworkProtocol';

import LAN_online_img from '@/assets/img/LAN-online.png';
import LAN_offline_img from '@/assets/img/LAN-offline.png';
import WiFi_online_img from '@/assets/img/WiFi-online.png';
import WiFi_offline_img from '@/assets/img/WiFi-offline.png';

defineProps<{
    device: IAfterLoginDevice
}>();

</script>

<template>
    <img
        v-if="device.networkProtocol === ENetworkProtocol.LAN"
        :src="device.isOnline ? LAN_online_img : LAN_offline_img"
        height="24"
        width="24"
        alt="lan"
    >
    <img
        v-else-if="device.networkProtocol === ENetworkProtocol.WIFI"
        :src="device.isOnline ? WiFi_online_img : WiFi_offline_img"
        height="24"
        width="24"
        alt="wifi"
    >
</template>

<style scoped lang="scss">
</style>