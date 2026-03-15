<script setup lang="ts">
import { registerBonusDebugHook } from './services/bonus.service';
import appMessage from './services/message.service';
import { syncVuetifyTheme } from './services/theme.service';
import { useMainStore } from './store/mainStore';

syncVuetifyTheme();
// 启用 Vuetify 深色模式
useMainStore().refreshExamData();
// 刷新当前考试数据
registerBonusDebugHook();
</script>

<template>
  <router-view />
  <v-snackbar-queue v-model="appMessage.messages"></v-snackbar-queue>
</template>

