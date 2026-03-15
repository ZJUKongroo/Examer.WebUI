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
  <v-snackbar-queue 
    v-model="appMessage.messages" 
    location="top start"
    :total-visible="5"
    transition="bouncy-slide-auto"
    closable
    variant="tonal"
    contained >
    <template v-slot:actions="{ props }">
        <v-btn
          aria-label="Close"
          icon="$close"
          size="small"
          variant="text"
          v-bind="props"
        ></v-btn>
      </template>
  </v-snackbar-queue>
</template>

<style>
.bouncy-slide-x-transition-enter-active,
.bouncy-slide-x-transition-leave-active,
.bouncy-slide-x-transition-move,
.bouncy-slide-x-reverse-transition-enter-active,
.bouncy-slide-x-reverse-transition-leave-active,
.bouncy-slide-x-reverse-transition-move {
  transition: transform, opacity;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bouncy-slide-x-transition-enter-from,
.bouncy-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(-30%);
}
.bouncy-slide-x-reverse-transition-enter-from,
.bouncy-slide-x-reverse-transition-leave-to {
  opacity: 0;
  transform: translateX(30%);
}
</style>

