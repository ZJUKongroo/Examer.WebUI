<template>
  <v-container>
    <UniversalHeader title="题目列表">
      <template #append>
        <v-btn variants="tonal" @click="createProblem">新建题目</v-btn>
      </template>
    </UniversalHeader>
    <div id="problem-edit-content">
      <div
        class="problem-edit-card"
        v-for="(problem, index) in problems"
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
              @click.stop="deleteProblem(problem, index)"
              icon="mdi-text-box-edit-outline"
            />
            <v-btn
              color="error"
              class="ml-2"
              @click.stop="deleteProblem(problem, index)"
              icon="mdi-delete"
            />
          </template>
          <v-card-text class="bg-surface-light pt-4">
            {{ problem.discription }}
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
            label="考试名称"
            required
          ></v-text-field>
          <v-textarea
            v-model="form.discription"
            label="考试名称"
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
import { useMainStore } from "~/store/mainStore";
import deleteConfirm from "~/ts/deleteConfirm";
import axios from "~/ts/request";
import UniversalHeader from "~/components/UniversalHeader.vue";

interface Problem {
  id: string;
  name: string;
  discription: string;
}

const store = useMainStore();
const problems = ref<Problem[]>([]);
const router = useRouter();
const route = useRoute();
const problemCreateVisible = ref(false);

const default_problem_value = {
  id: "",
  name: "",
  discription: "",
};

const form = ref<Problem>(Object.assign({}, default_problem_value));

const submitForm = () => {
  const newProblem = {
    id: `${problems.value.length + 1}`,
    name: form.value.name,
    discription: form.value.discription,
  };
  problems.value.push(newProblem);
  problemCreateVisible.value = false;
  form.value = Object.assign({}, default_problem_value);
};

const createProblem = () => {
  problemCreateVisible.value = true;
};

const deleteProblem = (problem: Problem, index: number) => {
  deleteConfirm(`${problem.name}`, false).then((res) => {
    if (res) {
      store.deleteExamData(index);
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
  console.log(id);
  return (await axios.get<Problem[]>(`/Problem/${id}`)).data;
}

onMounted(() => {
  getProblems().then((res)=>{
    problems.value = res;
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
  })
});
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
</style>
