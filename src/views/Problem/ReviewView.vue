<template>
  <v-container class="problem-review-container">
    <UniversalHeader title="题目A" class="problem-review-header">
      <template #append>
        <v-btn @click="submitReview">提交</v-btn>
      </template>
    </UniversalHeader>
    <div class="problem-review-content problem-review-header">
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
    <h2 class="problem-review-file-title problem-review-header mb-4">文件列表</h2>
    <div id="problem-review-file">
      <div class="problem-review-file-card mb-4" v-for="(file, index) in answerInfo.files"
      :key="index">
        <v-card
        class="problem-review-file-cards"
        :title="file.name"
        :subtitle="file.size"
        link
        prepend-icon="mdi-file"
        append-icon="mdi-open-in-new"
        variant="tonal"
      />
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import anime from "animejs";
import axios from '~/ts/request';
import { onMounted, ref } from "vue";
import UniversalHeader from "~/components/UniversalHeader.vue";

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

const submitReview = () => {
  // 提交评测逻辑
  console.log("提交评测:", answerInfo.value);
};

function getCommits () {
  // 获取提交记录
  debugger
  // axios.get('/commits').then((res) => {
  //   console.log(res.data);
  // });
}

onMounted(()=>{
  getCommits();
  anime({
    targets: ".problem-review-header",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  });
  anime({
    targets: ".problem-review-file-card",
    translateY: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100,{
      start:400
    }),
  })
})
</script>

<style>
.problem-review-container {
  padding: 20px;
}
</style>
