<script setup lang="ts">
import { getAssetsFile } from '@/utils/tools';

</script>

<template>
    <div class="searching-container">
        <img :src="getAssetsFile('img/background.png')" alt="background" class="background">
        <img :src="getAssetsFile('img/search.png')" alt="search" class="search">
    </div>
</template>

<style scoped lang="scss">
.searching-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .background {
        width: 239px;
        height: 170px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .search {
        width: 98px;
        height: 98px;
        position: absolute;
        top: 50%;
        left: 50%;
        animation: search 2s linear infinite;
        -webkit-animation: search 2s linear infinite; /* Safari and Chrome */
    }
}

@keyframes search {
    0% {
        transform: translate(-25px, -25px);
    }
    25% {
        transform: translate(0, -25px);
    }
    50% {
        transform: translate(0, 0);
    }
    75% {
        transform: translate(-25px, 0);
    }
    100% {
        transform: translate(-25px, -25px);
    }
}

</style>