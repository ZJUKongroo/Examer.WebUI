<template>
  <div class="problem-edit-container">
    <UniversalHeader title="题目列表" id="problem-edit-header">
      <template #append>
        <v-btn variants="tonal" @click="createProblem">新建题目</v-btn>
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
import { useRoute} from "vue-router";
import CDialog from "~/components/UI/CDialog.vue";
import deleteConfirm from "~/ts/deleteConfirm";
import { createProblem as createProblemApi, deleteProblem as removeProblem, getExamById, updateProblem } from "~/api";
import { handleApiError } from "~/api/error";
import UniversalHeader from "~/components/UniversalHeader.vue";
import type { Problem } from "~/types";
import { ElMessage } from "element-plus";

const problems = ref<Problem[]>([]);
const route = useRoute();
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

function checkProblemPayload(payload: {
  name: string;
  description: string;
  score: number | string;
}): payload is UpdateProblemDto {
  const name = payload.name.trim();
  const description = payload.description.trim();
  const score = Number(payload.score);

  if (!name) {
    ElMessage.error("题目名称不能为空");
    return false;
  }

  if (!description) {
    ElMessage.error("题目描述不能为空");
    return false;
  }

  if (!Number.isFinite(score) || score <= 0) {
    ElMessage.error("题目分数需为大于0的数字");
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

  return {
    name: payload.name.trim(),
    description: payload.description.trim(),
    score: Number(payload.score),
  };
}

function buildCreateProblemPayload(form: ProblemFormValue): CreateProblemDto | null {
  const examId = form.examId.trim();

  if (!examId) {
    ElMessage.error("缺少考试信息，无法创建题目");
    return null;
  }

  if (!Number.isInteger(form.problemType) || form.problemType <= 0) {
    ElMessage.error("题目类型无效");
    return null;
  }

  const payload = buildUpdateProblemPayload(form);
  if (!payload) {
    return null;
  }

  return {
    examId,
    problemType: form.problemType,
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
    ElMessage.success("编辑题目成功");
  }).catch((error) => {
    handleApiError(error, { fallbackMessage: "编辑题目失败" });
  });
}

const form = ref<ProblemFormValue>(createDefaultProblemForm());

const submitForm = () => {
  const payload = buildCreateProblemPayload({
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
    ElMessage.success("新建题目成功");
  }).catch((error) => {
    handleApiError(error, { fallbackMessage: "新建题目失败" });
  });
};

const createProblem = () => {
  problemCreateVisible.value = true;
};

const deleteProblem = (problem: Problem) => {
  deleteConfirm(`${problem.name}`, false).then((res) => {
    if (res) {
      removeProblem(problem.id).then(() => {
        ElMessage.success("已删除题目");
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
.problem-edit-container {
  padding: 40px;
}

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
