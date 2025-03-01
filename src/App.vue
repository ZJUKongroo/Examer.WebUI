<script setup lang="ts">
import { useBonus } from './composables/useBonus';
import { useVuetifyDarkmode } from './composables/useVuetifyDarkmode';
import { useMainStore } from './store/mainStore';

useVuetifyDarkmode();
// 启用 Vuetify 深色模式
useMainStore().refreshExamData();
// 刷新当前考试数据
useBonus();
</script>

<template>
  <router-view />
</template>

