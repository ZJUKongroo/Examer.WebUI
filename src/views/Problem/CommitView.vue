<script lang="ts" setup>
import anime from "animejs";
import UniversalHeader from "~/components/UniversalHeader.vue";
import { computed, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "~/store/mainStore";
import axios from '~/ts/request'
import { ElMessage } from "element-plus";
import type { Commit } from "~/types";
import CDialog from "~/components/UI/CDialog.vue";

const files = ref<File[]>([]);
const route = useRoute();
const router = useRouter();
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const store = useMainStore();
const examId = computed(() => route.query.examid as string);
const exam = computed(() => store.examData.find((exam) => exam.id === examId.value));
const problemId = computed(() => route.query.problemid as string);
const problem = computed(() => {
  const res = exam.value?.problems.find((problem) => problem.id === problemId.value);
  if (res) {
    nextTick(() => anime({
      targets: ".problem-commit-animation",
      translateX: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
    }))
  }
  return res;
});
const uploading = ref(false);
const uploadProgress = ref(0);

const handleFileUpload = (newFiles: FileList) => {
  for (let i = 0; i < newFiles.length; i++) {
    files.value.push(newFiles[i]);
  }
};

const handleDrop = (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    handleFileUpload(droppedFiles);
  }
};

function removeFile(index: number) {
  files.value.splice(index, 1);
}

function handleFileSelect() {
  const newFiles = fileInputRef.value?.files;
  if (newFiles) {
    handleFileUpload(newFiles);
  }
}

function submit() {
  if (files.value.length === 0) {
    ElMessage.warning("请先选择文件")
    return;
  }

  const formData = new FormData();
  files.value.forEach((file) => {
    formData.append("formFile", file);
  });

  uploading.value = true;
  uploadProgress.value = 0;
  axios.post<Commit>("/commit", {
    examId: examId.value,
    problemId: problemId.value,
    userId: store.userId
  }).then((res) => {
    const commitId = res.data.id;
    axios.post(`/commit/file/${commitId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    }).then(() => {
      uploading.value = false;
      router.back();
      ElMessage.success("提交成功")
    })
      .catch(() => {
        ElMessage.error("提交失败")
      });
  })
}
</script>

<template>
  <div class="problem-commit-container">
    <UniversalHeader :title="`试题 ${problem ? problem.name : ''}`" class="problem-commit-animation">
      <template #append>
        <v-btn @click="submit">提交</v-btn>
      </template>
    </UniversalHeader>
    <v-alert variant="tonal" type="info" class="problem-commit-animation">
      注意: 确认提交后你将无法修改此次提交。请使用新提交覆盖
    </v-alert>
    <div id="problem-commit-info" class="problem-commit-animation">
      <v-card>
        <v-card-title>题目信息</v-card-title>
        <v-card-text>
          <div v-if="problem?.description">
            <p><strong>描述:</strong> {{ problem.description }}</p>
          </div>
          <div v-else>
            <p>没有题目信息</p>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div id="problem-commit-upload">
      <div id="problem-commit-upload-title" class="problem-commit-animation">提交</div>
      <div id="problem-commit-upload-file">
        <v-card class="problem-commit-upload-cards" :title="file.name" v-for="(file, index) in files" :key="index">
          <template v-slot:append>
            <v-btn @click="removeFile(index)" icon="mdi-close" variant="text"></v-btn>
          </template>
        </v-card>
      </div>
      <div class="problem-commit-drop-zone problem-commit-animation" @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @click="fileInputRef?.click()"
        :class="{ dragging: isDragging }">
        <p>拖入文件，或单击选择文件</p>
      </div>
      <input ref="fileInputRef" type="file" @change="handleFileSelect" multiple style="display: none" />
    </div>
  </div>
  <CDialog v-model:visible="uploading" title="上传中">
    <template #content>
      <h1 class="mb-4">正在提交</h1>
      <div class="problem-commit-dialog-content">
        <template v-if="uploadProgress !== 0">
          <v-progress-circular :model-value="uploadProgress" :rotate="360" :size="100" :width="15" color="teal">
            <template v-slot:default> {{ uploadProgress }} % </template>
          </v-progress-circular>
        </template>
        <template v-else>
          创建提交中……
        </template>
      </div>
    </template>
  </CDialog>
</template>

<style>
.problem-commit-container {
  padding: 40px;
}

#problem-commit-info {
  margin-bottom: 20px;
}

/* #problem-commit-upload {
  display: flex;
  flex-direction: column;
} */

#problem-commit-upload-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.problem-commit-drop-zone {
  border: 2px dashed var(--bd-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.problem-commit-drop-zone:hover {
  background-color: var(--bg-color-shallow);
}

.dragging {
  background-color: var(--bg-color-shallow);
}

.problem-commit-upload-cards {
  margin-bottom: 15px;
}

.problem-commit-dialog-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
