<template>
  <div class="problem-review-container">
    <UniversalHeader title="题目A" class="problem-review-header">
      <template #append>
        <v-btn @click="submitReview">提交</v-btn>
      </template>
    </UniversalHeader>
    <template v-if="loading">
      <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 5" :key="n" />
    </template>
    <template v-else>
      <div v-if="answerInfo" class="problem-review-content problem-review-anime">
        <v-card class="mb-4" variant="tonal">
          <v-card-text>
            <div class="problem-review-content-wrapper">
              <div>
                <h1 class="mb-1">作答信息</h1>
                <div class="mb-2"><strong>提交时间:</strong> {{ (new Date(answerInfo.commitTime)).toLocaleString() }}</div>
                <div class="mb-2"><strong>题目名称:</strong> {{ answerInfo.problem.name }}</div>
                <div class="mb-2"><strong>提交者:</strong> {{ answerInfo.user.name }}</div>
                <div class="mb-2">
                  <strong>是否已经评测:</strong>
                  {{ reviewed ? "是" : "否" }}
                </div>
              </div>
              <div>
                <h1 class="mb-1">题目信息</h1>
                <div class="mb-2"><strong>题目名称:</strong> {{ answerInfo.problem.name }}</div>
                <div class="mb-2"><strong>题目描述:</strong> {{ answerInfo.problem.description }}</div>
                <div class="mb-2"><strong>题目分数:</strong> {{ answerInfo.problem.score }}</div>
              </div>
              <div>
                <h1 class="mb-1">考试信息</h1>
                <div class="mb-2"><strong>考试名称:</strong> {{ answerInfo.exam.name }}</div>
                <div class="mb-2"><strong>考试时间:</strong> {{ (new Date(answerInfo.exam.startTime)).toLocaleDateString()
                }} - {{ (new Date(answerInfo.exam.endTime)).toLocaleDateString() }}</div>
              </div>
            </div>
            <div v-if="reviewed" class="mb-4">
              <h1 class="mb-1">评测信息</h1>
              <div class="review-view-marking-container">
                <v-card v-for="(marking,index) in answerInfo.markings">
                  <template #prepend>
                    {{ index }}
                  </template>
                  <template #subtitle>
                    <strong>分数:</strong> {{marking.score}} <br/>
                    <strong>备注:</strong> {{ marking.comment }} <br/>
                  </template>
                </v-card>
              </div>
            </div>
            <v-text-field variants="tonal" v-model="score" label="打分" type="number"></v-text-field>
            <v-text-field variants="tonal" v-model="comment" label="评论"></v-text-field>
          </v-card-text>
        </v-card>
      </div>
      <h2 class="problem-review-file-title problem-review-anime mb-4">文件列表</h2>
      <div id="problem-review-file">
        <div class="problem-review-file-card mb-4" v-for="(file, index) in answerInfo?.files" :key="index">
          <v-card class="problem-review-file-cards" :title="file.fileName" :subtitle="file.size" link
            prepend-icon="mdi-file" append-icon="mdi-open-in-new" variant="tonal" @click="openFile(file)" />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import axios from '~/ts/request';
import { onMounted, ref, computed, watch, nextTick } from "vue";
import UniversalHeader from "~/components/UniversalHeader.vue";
import { useRoute } from "vue-router";
import type { Commit,Marking } from "~/types";
import { useMainStore } from "~/store/mainStore";
import { ElMessage} from "element-plus";
import { openFile } from "~/ts/previewFile";


const route = useRoute();
const commitId = computed(() => route.query.id as string);
const store = useMainStore();
const score = ref<number>(0);
const comment = ref<string>('');
const answerInfo = ref<Commit | null>(null);
const reviewed = computed(() => {
  if (answerInfo.value) {
    return answerInfo.value.markings.length > 0;
  }
  return false;
});
const loading = ref(false);

watch(commitId, () => init());

function init() {
  loading.value = true;
  anime({
    targets: ".problem-review-header",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  });
  getCommits().then(() => {
    loading.value = false;
    nextTick(() => {
      anime({
        targets: ".problem-review-anime",
        translateX: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
      });
      anime({
        targets: ".problem-review-file-card",
        translateY: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(50, {
          start: 300
        }),
      })
    })
  });
}

const submitReview = () => {
  // 提交评测逻辑
  const judge_score = Number(score.value);
  if (judge_score > 0 && answerInfo.value && judge_score <= answerInfo.value.problem.score) {
    axios.post<Marking>(`/marking`, {
      commitId: commitId.value,
      reviewUserId: store.userId,
      score: judge_score,
      comment: comment.value
    }).then(() => {
      // 提交成功
      ElMessage.success("提交成功");
      init()
    });
  }
  else {
    ElMessage.error("分数不合法");
  }
};

async function getCommits() {
  // 获取提交记录
  return new Promise<void>((resolve,) => {
    axios.get<Commit>(`/commit/${commitId.value.trim()}`).then((res) => {
      answerInfo.value = res.data;
      resolve()
    });
  })
}


onMounted(() => init())
</script>

<style>
.review-view-marking-container{
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.problem-review-container {
  padding: 40px;
}

.problem-review-content-wrapper {
  display: flex;
  gap: 10%;
  flex-direction: row;
  width: 100%;
}
</style>
