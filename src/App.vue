<script setup lang="ts">
import { useVuetifyDarkmode } from './composables/useVuetifyDarkmode';
import { useMainStore } from './store/mainStore';

useVuetifyDarkmode();
// 启用 Vuetify 深色模式
useMainStore().refreshExamData();
// 刷新当前考试数据
</script>

<template>
  <router-view />
</template>

