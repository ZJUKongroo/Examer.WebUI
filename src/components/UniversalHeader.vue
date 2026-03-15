<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{
  title: string;
  hideBackButton?: boolean;
}>();
const router = useRouter();
function back() {
  router.back();
}
</script>

<template>
    <div class="universal-header">
      <v-btn
        v-if="!hideBackButton"
        @click="back"
        icon="mdi-arrow-left"
        variant="text"
        density="comfortable"
      ></v-btn>
      <p class="universal-header-title">{{ title }}</p>
      <div>
        <slot name="append"></slot>
      </div>
    </div>
</template>

<style>
.universal-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.universal-header-title {
  font-size: 25px;
  font-weight: 800;
  margin-left: 12px;
  flex-grow: 1;
}
</style>

