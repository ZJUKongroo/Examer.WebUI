<template>
  <div class="problem-review-container">
    <UniversalHeader title="题目A" class="problem-review-header">
      <template #append>
        <v-btn @click="submitReview">提交</v-btn>
      </template>
    </UniversalHeader>
    <div v-if="answerInfo" class="problem-review-content problem-review-header">
      <v-card class="mb-4" variant="tonal">
        <v-card-title>作答信息</v-card-title>
        <v-card-text>
          <div class="mb-2"><strong>提交时间:</strong> {{ (new Date(answerInfo.commitTime)).toLocaleString() }}</div>
          <div class="mb-2"><strong>题目名称:</strong> {{ answerInfo.problem.name }}</div>
          <div class="mb-2">
            <strong>是否已经评测:</strong>
            {{ reviewed ? "是" : "否" }}
          </div>
          <div v-if="reviewed">
            <strong>分数:</strong> {{ answerInfo.markings[0].score }}
          </div>
          <v-text-field
            v-else
            v-model="score"
            label="打分"
            type="number"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </div>
    <h2 class="problem-review-file-title problem-review-header mb-4">文件列表</h2>
    <div id="problem-review-file">
      <div class="problem-review-file-card mb-4" v-for="(file, index) in files"
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
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import axios from '~/ts/request';
import { onMounted, ref, computed, watch } from "vue";
import UniversalHeader from "~/components/UniversalHeader.vue";
import { useRoute } from "vue-router";
import type { Commit, Marking } from "~/types";
import { useMainStore } from "~/store/mainStore";
import { ElMessage } from "element-plus";

const route = useRoute();
const commitId = computed(() => route.query.id as string);
const store = useMainStore();
const score = ref<number>(0);
const answerInfo = ref<Commit|null>(null);
const reviewed = computed(() => {
  if(answerInfo.value){
    return answerInfo.value.markings.length > 0;
  }
  return false;
});
const files = ref<File[]>([]);

watch(commitId, () => init());

function init(){
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
}

const submitReview = () => {
  // 提交评测逻辑
  axios.post<Marking>(`/marking`, {
    commitId: commitId.value,
    reviewUserId: store.userId,
    score: score.value,
  }).then(() => {
    // 提交成功
    ElMessage.success("提交成功");
    init()
  });
};

function getCommits () {
  // 获取提交记录
  axios.get<Commit>(`/commit/${commitId.value}`).then((res) => {
    answerInfo.value = res.data;
  });
}

onMounted(()=>init())
</script>

<style>
.problem-review-container {
  padding: 40px;
}
</style>
