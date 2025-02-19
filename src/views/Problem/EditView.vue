<template>
  <v-container class="problem-edit-container">
    <UniversalHeader title="题目列表" id="problem-edit-header">
      <template #append>
        <v-btn variants="tonal" @click="createProblem">新建题目</v-btn>
      </template>
    </UniversalHeader>
    <div id="problem-edit-content">
      <div
        class="problem-edit-card"
        v-for="problem in problems"
        :key="problem.id"
      >
        <v-card
          link
          :title="`${problem.name}`"
          @click="open('/problem/edit', { id: problem.id })"
        >
          <!-- <v-card-subtitle>{{ exam.description }}</v-card-subtitle> -->
          <template #append>
            <v-btn
              variants="plain"
              @click.stop="deleteProblem(problem)"
              icon="mdi-text-box-edit-outline"
            />
            <v-btn
              color="error"
              class="ml-2"
              @click.stop="deleteProblem(problem)"
              icon="mdi-delete"
            />
          </template>
          <v-card-text class="bg-surface-light pt-4">
            {{ problem.description }}
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
  <CDialog
    v-model:visible="problemCreateVisible"
    title="新建题目"
    width="700px"
    height="500px"
  >
    <template #content>
      <div id="exam-create-dialog-container">
        <h1 class="mb-4">新建题目</h1>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="form.name"
            label="题目名称"
            required
          ></v-text-field>
          <v-textarea
            v-model="form.description"
            label="题目描述"
            required
          ></v-textarea>
          <v-btn variants="tonal" type="submit">提交</v-btn>
        </v-form>
      </div>
    </template>
  </CDialog>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import CDialog from "~/components/UI/CDialog.vue";
import deleteConfirm from "~/ts/deleteConfirm";
import axios from "~/ts/request";
import UniversalHeader from "~/components/UniversalHeader.vue";
import type { Exam, Problem } from "~/types";
import { ElMessage } from "element-plus";

const problems = ref<Problem[]>([]);
const router = useRouter();
const route = useRoute();
const problemCreateVisible = ref(false);

interface ProblemForm {
  examId: string;
  name: string;
  description: string;
  problemType: number;
}

const default_form_value = {
  examId: "",
  name: "",
  description: "",
  problemType: 1,
};

const form = ref<ProblemForm>(Object.assign({}, default_form_value));

const submitForm = () => {
  form.value.examId = route.query.id as string;
  axios.post("/Problem", form.value).then(() => {
    getProblems();
    problemCreateVisible.value = false;
    form.value = Object.assign({}, default_form_value);
    ElMessage.success("新建题目成功");
  }).catch(() => {
    ElMessage.error("新建题目失败");
  });
};

const createProblem = () => {
  problemCreateVisible.value = true;
};

const deleteProblem = (problem: Problem) => {
  deleteConfirm(`${problem.name}`, false).then((res) => {
    if (res) {
      axios.delete(`/Problem/${problem.id}`).then(() => {
        ElMessage.success("已删除题目");
        getProblems();
      }).catch(() => {
        ElMessage.error("删除题目失败");
      });
    }
  });
};

function open(path: string, query?: any) {
  router.push({
    path,
    query,
  });
}

async function getProblems() {
  const id = route.query.id;
  problems.value = (await axios.get<Exam>(`/Exam/${id}`)).data.problems;
}

onMounted(() => {
  getProblems().then(() => {
    anime({
      targets: "#problem-edit-header",
      opacity: [0, 1],
      translateX: [20, 0],
      loop: false,
      duration: 500,
    });
    anime({
      targets: ".problem-edit-card",
      opacity: [0, 1],
      translateY: [20, 0],
      loop: false,
      duration: 500,
      delay: anime.stagger(100),
    });
  });
});
</script>

<style>
.problem-edit-container{
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
</style>
