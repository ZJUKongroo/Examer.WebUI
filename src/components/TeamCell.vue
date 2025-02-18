<template>
  <div class="team-cell" ref="cellRef" @click="toggleExpand">
    <div class="team-cell-header">
      {{ info.name }}
    </div>
    <div v-if="isExpanded" class="team-cell-details">
      <div>手机: {{ info.phoneNo }}</div>
      <div>学号: {{ info.studentNo }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import { defineProps } from 'vue';
import type { User } from '~/types';

defineProps({
  info: {
    type: Object as PropType<User>,
    required: true,
  }
});

const isExpanded = ref(false);
const cellRef = ref<HTMLElement|null>(null);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  if(cellRef.value) cellRef.value.style.height = isExpanded.value?(cellRef.value.scrollHeight+cellRef.value.offsetHeight) + "px":"25px";
};
</script>

<style>
.team-cell {
  border-radius: 12px;
  width: calc(100% - 20px);
  height: 25px;
  font-size: 15px;
  font-weight: 500;
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
  overflow: hidden;
  box-sizing: content-box;
}

.team-cell:hover {
  background-color: var(--bg-color-solid);
}

.team-cell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-cell-details {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
</style>
