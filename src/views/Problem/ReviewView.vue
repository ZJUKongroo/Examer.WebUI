<template>
  <v-container>
    <div id="problem-review-header">
      <v-btn
        @click="back"
        icon="mdi-arrow-left"
        variant="text"
        density="comfortable"
      ></v-btn>
      <p id="problem-review-title">题目A</p>
      <v-btn @click="submitReview">提交</v-btn>
    </div>
    <div class="content">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>作答信息</v-card-title>
        <v-card-text>
          <div class="mb-2"><strong>提交时间:</strong> {{ answerInfo.submitTime }}</div>
          <div class="mb-2"><strong>题目名称:</strong> {{ answerInfo.title }}</div>
          <div class="mb-2">
            <strong>是否已经评测:</strong>
            {{ answerInfo.reviewed ? "是" : "否" }}
          </div>
          <div v-if="answerInfo.reviewed">
            <strong>分数:</strong> {{ answerInfo.score }}
          </div>
          <v-text-field
            v-else
            v-model="answerInfo.score"
            label="打分"
            type="number"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </div>
    <div id="problem-review-file">
      <h2 class="problem-review-file-title">文件列表</h2>
      <v-card
        class="problem-review-file-cards"
        :title="file.name"
        :subtitle="file.size"
        link
        prepend-icon="mdi-file"
        append-icon="mdi-open-in-new"
        variant="tonal"
        v-for="(file, index) in answerInfo.files"
        :key="index"
      />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface File {
  name: string;
  size: string;
}

const answerInfo = ref({
  submitTime: "2023-10-01 12:00:00",
  title: "题目 1",
  reviewed: false,
  score: null,
  files: [
    {
      name: "file1",
      size: "1MB",
    },
    {
      name: "file2",
      size: "2MB",
    },
    {
      name: "file3",
      size: "3MB",
    },
  ] as File[],
});

function back() {
  window.history.back();
}

const submitReview = () => {
  // 提交评测逻辑
  console.log("提交评测:", answerInfo.value);
};
</script>

<style>
#problem-review-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  width: 100%;
}

#problem-review-title {
  font-size: 22px;
  font-weight: bold;
  margin-left: 12px;
  flex-grow: 1;
}

#problem-review-file h2 {
  margin-bottom: 10px;
}

#problem-review-file .v-card{
  margin-bottom: 10px;
}
</style>
