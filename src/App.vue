<script setup lang="ts">
import { useVuetifyDarkmode } from './composables/useVuetifyDarkmode';
import { useMainStore } from './store/mainStore';

useVuetifyDarkmode();
useMainStore().refreshExamData();
</script>

<template>
  <router-view />
</template>

