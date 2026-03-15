<template>
  <div class="exam-cell">
    <div class="exam-cell-icon">
      <v-icon v-if="info.examType==ExamType.UserExam">mdi-account-outline</v-icon>
      <v-icon v-else>mdi-account-group-outline</v-icon>
    </div>
    <div class="exam-cell-content">
      <div class="exam-cell-content-name">{{ info.name }}</div>
      <small class="exam-cell-content-time">{{ (new Date(info.startTime)).toLocaleDateString() }} - {{ (new Date(info.endTime)).toLocaleDateString() }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from "vue";
import { ExamType } from "~/enums";
import type { Exam } from "~/types";

defineProps({
  info: {
    type: Object as PropType<Exam>,
    required: true,
  },
});
</script>

<style>
.exam-cell {
  border-radius: 12px;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  margin-bottom: 5px;
  text-align: center;
  display: flex;
  flex-direction: row;
}

.exam-cell-icon{
  display: flex;
  place-content: center;
  margin-right: 10px;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
}

.exam-cell-content {
  display: flex;
  flex-direction: column;
  width: calc(100% - 34px);
  font-size: 15px;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  justify-content: center;
  align-items: flex-start;
}

.exam-cell-content-name{
  font-size: 13px;
  width: 100%;
  text-align: left;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.exam-cell-content-time{
  font-size: 10px;
  font-weight: 300;
}

.exam-cell:hover {
  background-color: var(--bg-color-darker);
}
</style>
