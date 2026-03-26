<template>
  <div class="problem-edit-container global-container">
    <UniversalHeader title="题目列表" id="problem-edit-header">
      <template #append>
        <v-btn variants="tonal" @click="createProblem">新建题目</v-btn>
        <v-btn variants="tonal" @click="openReview" class="ml-2">前往批改</v-btn>
      </template>
    </UniversalHeader>
    <div id="problem-edit-content">
      <div class="problem-edit-card" v-for="problem in problems" :key="problem.id">
        <v-card :title="`${problem.name}`">
          <!-- <v-card-subtitle>{{ exam.description }}</v-card-subtitle> -->
          <template #append>
            <v-btn variants="plain" @click.stop="editProblem(problem)" icon="mdi-text-box-edit-outline" />
            <v-btn color="error" class="ml-2" @click.stop="deleteProblem(problem)" icon="mdi-delete" />
          </template>
          <v-card-text class="bg-surface-light pt-4">
            {{ problem.description }}
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
  <CDialog v-model:visible="problemCreateVisible" title="新建题目" width="700px" height="500px">
    <template #content>
      <div class="problem-dialog-container">
        <h1 class="mb-4">新建题目</h1>
        <v-form @submit.prevent="submitForm">
          <v-text-field v-model="form.name" label="题目名称" required></v-text-field>
          <v-text-field v-model="form.score" label="题目分数" type="number"></v-text-field>
          <v-textarea v-model="form.description" label="题目描述" required></v-textarea>
          <v-btn variants="tonal" type="submit">提交</v-btn>
        </v-form>
      </div>
    </template>
  </CDialog>
  <CDialog v-model:visible="problemEditVisible" title="编辑题目" width="700px" height="500px">
    <template #content>
      <div class="problem-dialog-container">
        <h1 class="mb-4">编辑题目</h1>
        <v-form @submit.prevent="confirmEditProblem">
          <v-text-field v-model="editForm.name" label="题目名称" required></v-text-field>
          <v-text-field v-model="editForm.score" label="题目分数" type="number"></v-text-field>
          <v-textarea v-model="editForm.description" label="题目描述" required></v-textarea>
          <v-btn variants="tonal" type="submit">提交</v-btn>
        </v-form>
      </div>
    </template>
  </CDialog>
</template>

<script lang="ts" setup>
import { animate, spring, stagger } from "animejs";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter} from "vue-router";
import CDialog from "~/components/UI/CDialog.vue";
import { confirmDialog } from "~/services/dialog.service";
import { createProblem as createProblemApi, deleteProblem as removeProblem, getExamById, updateProblem } from "~/api";
import { handleApiError } from "~/api/error";
import { buildCreateProblemPayload as mapCreateProblemPayload, buildProblemPayload } from "~/mappers";
import UniversalHeader from "~/components/UniversalHeader.vue";
import type { Problem } from "~/types";
import appMessage from "~/services/message.service";

const problems = ref<Problem[]>([]);
const route = useRoute();
const router = useRouter();
const problemCreateVisible = ref(false);
const problemEditVisible = ref(false);
const editForm = ref<Problem>({
  id: "",
  name: "",
  description: "",
  problemType: 1,
  score: 100
});
const examId = computed(() => {
  return route.query.id as string;
});

watch(examId, () => init());

interface ProblemFormValue {
  examId: string;
  name: string;
  description: string;
  problemType: number;
  score: number | string;
}

interface UpdateProblemDto {
  name: string;
  description: string;
  score: number;
}

interface CreateProblemDto extends UpdateProblemDto {
  examId: string;
  problemType: number;
}

function createDefaultProblemForm(): ProblemFormValue {
  return {
    examId: "",
    name: "",
    description: "",
    problemType: 1,
    score: 100,
  };
}

function openReview(){
  router.push({
    path: "/exam/review",
    query: {
      id: examId.value,
    },
  });
};

function checkProblemPayload(payload: {
  name: string;
  description: string;
  score: number | string;
}): payload is UpdateProblemDto {
  const sanitized = buildProblemPayload(payload);

  if (!sanitized.name) {
    appMessage.error("题目名称不能为空");
    return false;
  }

  if (!sanitized.description) {
    appMessage.error("题目描述不能为空");
    return false;
  }

  if (!Number.isFinite(sanitized.score) || sanitized.score <= 0) {
    appMessage.error("题目分数需为大于0的数字");
    return false;
  }

  return true;
}

function buildUpdateProblemPayload(payload: {
  name: string;
  description: string;
  score: number | string;
}): UpdateProblemDto | null {
  if (!checkProblemPayload(payload)) {
    return null;
  }

  return buildProblemPayload(payload);
}

function buildCreatePayload(form: ProblemFormValue): CreateProblemDto | null {
  const sanitized = mapCreateProblemPayload({
    examId: form.examId,
    problemType: form.problemType,
    name: form.name,
    description: form.description,
    score: form.score,
  });

  if (!sanitized.examId) {
    appMessage.error("缺少考试信息，无法创建题目");
    return null;
  }

  if (!Number.isInteger(sanitized.problemType) || sanitized.problemType <= 0) {
    appMessage.error("题目类型无效");
    return null;
  }

  const payload = buildUpdateProblemPayload(sanitized);
  if (!payload) {
    return null;
  }

  return {
    examId: sanitized.examId,
    problemType: sanitized.problemType,
    ...payload,
  };
}

function editProblem(problem: Problem) {
  editForm.value = Object.assign({}, problem);
  problemEditVisible.value = true;
}

function confirmEditProblem() {
  const payload = buildUpdateProblemPayload(editForm.value);
  if (!payload) {
    return;
  }

  updateProblem(editForm.value.id, payload).then(() => {
    getProblems();
    problemEditVisible.value = false;
    appMessage.success("编辑题目成功");
  }).catch((error) => {
    handleApiError(error, { fallbackMessage: "编辑题目失败" });
  });
}

const form = ref<ProblemFormValue>(createDefaultProblemForm());

const submitForm = () => {
  const payload = buildCreatePayload({
    ...form.value,
    examId: route.query.id as string,
  });
  if (!payload) {
    return;
  }

  createProblemApi(payload).then(() => {
    getProblems();
    problemCreateVisible.value = false;
    form.value = createDefaultProblemForm();
    appMessage.success("新建题目成功");
  }).catch((error) => {
    handleApiError(error, { fallbackMessage: "新建题目失败" });
  });
};

const createProblem = () => {
  problemCreateVisible.value = true;
};

const deleteProblem = (problem: Problem) => {
  confirmDialog({
    title: `删除 ${problem.name}`,
    message: "删除是危险行为，请点击确认以执行。",
    warningText: "请谨慎操作",
    confirmText: "确认",
    cancelText: "取消",
    confirmColor: "error",
  }).then((res) => {
    if (res) {
      removeProblem(problem.id).then(() => {
        appMessage.success("已删除题目");
        getProblems();
      }).catch((error) => {
        handleApiError(error, { fallbackMessage: "删除题目失败" });
      });
    }
  });
};

async function getProblems() {
  const id = route.query.id;
  problems.value = (await getExamById(String(id))).data.problems;
}

function init() {
  getProblems().then(() => {
    animate("#problem-edit-header", {
      opacity: [0, 1],
      translateX: [20, 0],
      loop: false,
      ease: spring(),
    });
    animate(".problem-edit-card", {
      opacity: [0, 1],
      translateY: [20, 0],
      loop: false,
      delay: stagger(100),
      ease: spring(),
    });
  });
}

onMounted(() => init());
</script>

<style>
#exam-create-dialog-container {
  padding: 20px;
  box-sizing: border-box;
}

#problem-edit-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

#problem-edit-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

.problem-edit-card {
  width: calc(33% - 20px);
}

.problem-dialog-container {
  padding: 20px;
  box-sizing: border-box;
}
</style>
