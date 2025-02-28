<script lang="ts" setup>
import anime from "animejs";
import UniversalHeader from "~/components/UniversalHeader.vue";
import { computed, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "~/store/mainStore";
import axios from '~/ts/request'
import { ElMessage } from "element-plus";
import type { Commit, Group } from "~/types";
import CDialog from "~/components/UI/CDialog.vue";
import { ExamType } from "~/enums";

// 用户要提交的文件
const files = ref<File[]>([]);

const router = useRouter();
const route = useRoute();
const store = useMainStore();
const isDragging = ref(false);

// 根据路由查询参数获取考试和试题 ID
const examId = computed(() => route.query.examid as string);
const problemId = computed(() => route.query.problemid as string);

// 查找当前考试中的试题信息
const exam = computed(() => store.examData.find((exam) => exam.id === examId.value));
const problem = computed(() => {
  const res = exam.value?.problems.find((problem) => problem.id === problemId.value);
  if (res) {
    nextTick(() => {
      anime({
        targets: ".problem-commit-animation",
        translateX: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
      })
    })
  }
  return res;
});

// 用于显示上传状态及进度
const uploading = ref(false);
const uploadingVisible = ref(false)
const uploadProgress = ref<{ [name: string]: number }>({});

interface FileDto {
  id: string
  fileName: string,
  fileType: number
}

// 文件上传：将选中的新文件加入文件列表
const handleFileUpload = (newFiles: FileList) => {
  for (let i = 0; i < newFiles.length; i++) {
    files.value.push(newFiles[i]);
  }
};

// 拖拽事件：当文件拖拽进入放置区域后，触发文件上传
const handleDrop = (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    // 调用文件上传逻辑
    handleFileUpload(droppedFiles);
  }
};

// 删除指定索引的文件（从待上传列表中移除）
function removeFile(index: number) {
  files.value.splice(index, 1);
}

// 文件选择：通过文件输入框选择文件后触发上传
function handleFileSelect() {
  const newFiles = fileInputRef.value?.files;
  if (newFiles) {
    handleFileUpload(newFiles);
  }
}

const fileInputRef = ref<HTMLInputElement | null>(null);

// 提交处理流程：包括提交基本信息、上传各个文件、更新上传进度、错误处理等
async function submit() {
  // 如果没有选择文件，则提示警告
  if (files.value.length === 0) {
    ElMessage.warning("请先选择文件");
    return;
  }

  let userId = store.userId;

  if(exam.value?.examType === ExamType.GroupExam){
    const groupInfo = (await axios.get<Group>(`/user/groups/${store.userId}`,{
      params:{
        examId: examId.value
      }
    })).data;
    userId = groupInfo.id;
  }
  const currentCommit = (await axios.get<Commit[]>(`/Commit`, {
      params: {
        examId: examId.value,
        problemId: problemId.value,
        userId
      }
    })).data;
  let currentCommitId = "";
  if(currentCommit.length > 0){
    currentCommitId = currentCommit[0].id;
  }
  // 开启上传对话框
  uploadingVisible.value = true;

  try {
    // 提交基本的提交信息，获取提交记录 ID
    const { data: commit } = await axios.post<Commit>("/commit", {
      examId: examId.value,
      problemId: problemId.value,
      userId: userId
    });
    const commitId = commit.id;
    uploading.value = true;

    // 遍历选中的文件，上传每个文件
    const uploadPromises = files.value.map(async (file) => {
      const formData = new FormData();
      formData.append("formFile", file);
      uploadProgress.value[file.name] = 0;
      // 先通过接口获取文件记录 ID
      const { data } = await axios.post<FileDto>("/file", {
        parentId: commitId,
        fileType: 2
      });
      try {
        // 上传文件实际内容，绑定上传进度
        await axios.post(`/file/blob/${data.id}`, formData, {
          headers: {
            // 注意：不建议手动设置 Content-Type，浏览器会自动添加 boundary
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              uploadProgress.value[file.name] = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            }
          }
        });
        // 上传完成后确认提交
        await axios.post(`/commit/confirmation/${commitId}`);
      } catch (e) {
        // 如果上传失败，则删除中间记录，并显示错误提示
        // await axios.delete(`/file/${data.id}`);
        if(currentCommitId){
          await axios.post(`/commit/confirmation/${currentCommitId}`);
        }
        ElMessage.error("上传失败");
      }
    });

    // 等待所有文件上传完成
    await Promise.all(uploadPromises);
    ElMessage.success("提交成功");
    router.back(); // 上传成功后返回上一个页面
  } catch (error) {
    // 基本提交失败时提示错误
    ElMessage.error("提交失败");
  } finally {
    // 重置上传状态和进度
    uploading.value = false;
    uploadingVisible.value = false;
    uploadProgress.value = {};
  }
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
        <!-- 显示待上传的文件列表 -->
        <v-card class="problem-commit-upload-cards" :title="file.name" v-for="(file, index) in files" :key="index">
          <template v-slot:append>
            <!-- 删除文件按钮 -->
            <v-btn @click="removeFile(index)" icon="mdi-close" variant="text"></v-btn>
          </template>
        </v-card>
      </div>
      <!-- 拖拽上传区域 -->
      <div class="problem-commit-drop-zone problem-commit-animation" @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @click="fileInputRef?.click()"
        :class="{ dragging: isDragging }">
        <p>拖入文件，或单击选择文件</p>
      </div>
      <!-- 隐藏的文件选择 input -->
      <input ref="fileInputRef" type="file" @change="handleFileSelect" multiple style="display: none" />
    </div>
  </div>
  <!-- 文件上传过程中的对话框 -->
  <CDialog v-model:visible="uploadingVisible" title="上传中" width="500px" height="450px">
    <template #content>
      <div style="padding: 20px;">
        <h1 class="mb-4">正在提交</h1>
        <div class="problem-commit-dialog-content">
          <template v-if="uploading" v-for="(progress, name) in uploadProgress">
            <div class="problem-commit-dialog-files">
              <h2 class="mb-4">{{ name }}</h2>
              <v-progress-linear :model-value="progress" :rotate="360" :size="100" height="20">
                <template #default>
                  {{ progress }}%
                </template>
              </v-progress-linear>
            </div>
          </template>
          <template v-else>
            创建提交中……
          </template>
        </div>
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

.problem-commit-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.problem-commit-dialog-files {
  width: 100%;
}
</style>
