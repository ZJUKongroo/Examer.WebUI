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
                <div class="mb-2">
                  <strong>是否已经评测:</strong>
                  {{ reviewed ? "是" : "否" }}
                </div>
                <div v-if="reviewed" class="mb-4">
                  <strong>分数:</strong> {{answerInfo.markings.map((marking) => marking.score)}}
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
            <v-text-field variants="tonal" v-model="score" label="打分" type="number"></v-text-field>
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
import type { Commit, CommitFile, Marking } from "~/types";
import { useMainStore } from "~/store/mainStore";
import { ElMessage, ElMessageBox, type Action } from "element-plus";
import { useCommitStore } from "~/store/commitStore";
import { renderAsync } from 'docx-preview';

const route = useRoute();
const commitId = computed(() => route.query.id as string);
const store = useMainStore();
const commitStore = useCommitStore();
const score = ref<number>(0);
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
        delay: anime.stagger(100, {
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

// 添加 docx 到预览类型列表
const PreviewFileType = ["jpg", "jpeg", "png", "pdf", "tiff", "webp", "mp4", "mp3", "txt", "gif", "wav", "docx"];

function openFile(file: CommitFile) {
  const fileExtension = file.fileName.split('.').pop()?.toLowerCase();
  axios.get(`/file/blob/${file.id.trim()}`, { responseType: 'blob' }).then((response) => {
    const blob: Blob = response.data;
    const url = URL.createObjectURL(new Blob([blob], {
      type: response.headers["content-type"] as string
    }));

    // 处理 Word 文档
    if (fileExtension === "docx") {
      // 显示选择对话框
      ElMessageBox.confirm(`是否预览 "${file.fileName}"?`, '预览', {
        confirmButtonText: '预览',
        cancelButtonText: '下载',
        type: 'warning',
        distinguishCancelAndClose: true,
      }).then(() => {
        previewDocxFile(blob, file);
      }).catch((action: Action) => {
        if (action === 'cancel') {
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.fileName);
          link.click();
          window.URL.revokeObjectURL(url);
          return;
        }
      })
    }
    else if (fileExtension && PreviewFileType.includes(fileExtension)) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.fileName);
      link.click();
      window.URL.revokeObjectURL(url);
    }
  });
}

function previewDocxFile(blob: Blob, file: CommitFile) {
  const tempUrl = URL.createObjectURL(blob);
  const newWindow = window.open(tempUrl, '_blank');
  if (newWindow) {
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${file.fileName} - 文档预览</title>
          <style>body { margin: 0;  }</style>
        </head>
        <body>
          <div id="docx-container"></div>
        </body>
        </html>
      `);
    newWindow.document.close();

    // 将 blob 转为 ArrayBuffer 后渲染
    blob.arrayBuffer().then((buffer) => {
      const container = newWindow.document.getElementById('docx-container');
      if (container) renderAsync(buffer, container, undefined, {
        className: 'docx-viewer',
        inWrapper: true
      });
    });
  }
}

onMounted(() => init())
</script>

<style>
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
