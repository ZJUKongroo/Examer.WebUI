<template>
  <div class="exam-cell">
    {{ name }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<style>
.exam-cell {
  border-radius: 12px;
  width: 100%;
  height: 40px;
  font-size: 15px;
  font-weight: 500;
  box-sizing: border-box;
  padding: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  text-align: center;
  line-height: 30px;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.exam-cell:hover {
  background-color: var(--bg-color-darker);
}
</style>
