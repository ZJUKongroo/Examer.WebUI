<template>
  <div class="sidebar-cell">
    <v-icon :icon="iconClass"></v-icon>
    <span>{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
  iconClass: {
    type: String,
    required: true,
  },
});
</script>

<style>
.sidebar-cell {
  display: flex;
  border-radius: 17px;
  width: 100%;
  height: 46px;
  font-size: 17px;
  font-weight: 700;
  box-sizing: border-box;
  padding: 5px;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.sidebar-cell:hover {
  background-color: var(--bg-color-solid);
}

.sidebar-cell i {
    height: 100%;
    width: 46px;
  margin-right: 10px;
}
</style>
