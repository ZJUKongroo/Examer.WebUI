<template>
  <div id="exam-container">
    <UniversalHeader :title="exam ? exam.name : ''" class="exam-commit-header exam-commit-second-in" />
    <div v-if="exam?.examType === ExamType.GroupExam" class="exam-commit-second-in mb-2">
      <v-alert variant="tonal" show-icon :closable="false" type="info">
        本场考试为小组考试，你的提交会覆盖同组其他成员的提交
      </v-alert>
    </div>
    <v-alert class="exam-commit-second-in" variant="tonal" show-icon :closable="false">
      <strong>Hint: </strong>右键题目卡片可以查看上次提交
    </v-alert>
    <container id="exam-wrapper">
      <main id="exam-main">
        <div class="exam-commit-left-column">
          <div v-ripple @contextmenu.prevent="(e) => handleMenuOpen(e, problem)" @click="openProblem(problem)"
            v-for="(problem, index) in problems" :key="index" class="exam-commit-second-in exam-commit-card" :class="[
              { completed: commitStatus[problem.id] != undefined },
            ]">
            <div class="exam-commit-number">试题 {{ problem.name }}</div>
            <div v-if="commitStatus[problem.id]" class="exam-commit-status">
              上次提交 <br />
              {{ (new Date(commitStatus[problem.id].commitTime)).toLocaleString() }}
            </div>
            <div v-else class="exam-commit-status">尚未提交</div>
          </div>
        </div>
      </main>
      <!-- <aside id="exam-commit-aside" class="exam-commit-second-in">
        <div class="exam-commit-right-column">
          <div  class="exam-commit-team-info">
            <div class="exam-commit-team-info-title">队伍信息</div>
            <TeamCell v-ripple v-for="member in members" :info="member" />
          </div>
          <div class="exam-commit-score-card">
            <div class="exam-commit-score-title">分数</div>
            <div class="exam-commit-score-value">{{ score }}</div>
          </div>
        </div>
      </aside> -->
    </container>
  </div>
  <Teleport to="body">
    <CRMenu ref="menu" v-model:visible="menuVisible" @handleOpen="handleMenuOpen" class="exam-commit-second-in">
      <template #content v-if="selectedProblem">
        <CRMenuCell @click="openProblem(selectedProblem)" v-ripple>
          <template v-slot:icon>
            <v-icon>mdi-file-edit</v-icon>
          </template>
          作答
        </CRMenuCell>
        <CRMenuCell @click="inspectProblem(selectedProblem)" v-ripple>
          <template v-slot:icon>
            <v-icon>mdi-information</v-icon>
          </template>
          查看题目信息
        </CRMenuCell>
      </template>
    </CRMenu>
  </Teleport>
  <CDialog v-model:visible="inspectVisible" width="500px" height="400px">
    <template #content>
      <template v-if="selectedCommit">
        <div class="exam-commit-inspect-dialog">
          <section class="exam-commit-inspect-anime">
            <h2 class="mb-4">提交信息</h2>
            <p class="mb-2"><strong>提交时间:</strong> {{ (new Date(selectedCommit.commitTime)).toLocaleString() }}</p>
            <p class="mb-4"><strong>提交用户:</strong>{{ selectedCommit.user.name }}</p>
            <h3 class="mb-2">文件列表</h3>
          </section>
          <div class="exam-commit-inspect-anime mb-4" v-for="(file, index) in selectedCommit.files" :key="index">
            <v-card class="exam-commit-inspect-file-cards" :title="file.fileName" :subtitle="file.size" link @click="openFile(file)"
              prepend-icon="mdi-file" append-icon="mdi-open-in-new" variant="tonal" />
          </div>
        </div>
      </template>
      <template v-else>
        <div style="text-align: center;padding: 20px;">
          暂无作答信息
        </div>
      </template>
    </template>
  </CDialog>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// import TeamCell from "~/components/TeamCell.vue";
import { ExamType } from "~/enums";
import { useMainStore } from "~/store/mainStore";
import type { Commit, Exam, Group, Problem } from "~/types";
import UniversalHeader from "~/components/UniversalHeader.vue";
import axios from '~/ts/request'
import CRMenu from "~/components/UI/CRMenu.vue";
import CRMenuCell from "~/components/UI/CRMenuCell.vue";
import CDialog from "~/components/UI/CDialog.vue";
import { openFile } from "~/ts/previewFile";

const router = useRouter();
const store = useMainStore();
const examId = computed(() => router.currentRoute.value.query.id as string);
const exam = computed(() => {
  const res = store.examData.find((exam) => exam.id === examId.value)
  if (res) getCommitStatus(res);
  nextTick(() => anime({
    targets: ".exam-commit-second-in",
    translateY: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(50, {
      start: 200
    }),
  }))
  return res;
});
const commitStatus = ref<{ [problemId: string]: Commit }>({});
const problems = computed(() => exam.value?.problems);
const selectedProblem = ref<Problem | null>(null);
const selectedCommit = ref<Commit | null>(null);
const menuVisible = ref(false);
const inspectVisible = ref(false);
const menu = ref<InstanceType<typeof CRMenu> | null>(null);

function handleMenuOpen(event: MouseEvent, problem: Problem) {
  selectedProblem.value = problem;
  menuVisible.value = true;
  nextTick(() => {
    menu.value?.handleOpen(event.clientX, event.clientY);
  })
}

function inspectProblem(problem: Problem) {
  selectedCommit.value = commitStatus.value[problem.id];
  inspectVisible.value = true;
  menuVisible.value = false;
  nextTick(() => {
    anime({
      targets: ".exam-commit-inspect-anime",
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(50),
    })
  })
}

function openProblem(problem: Problem) {
  menuVisible.value = false;
  router.push({
    path: "/problem/commit",
    query: {
      examid: examId.value,
      problemid: problem.id,
    },
  });
}

async function getCommitStatus(exam: Exam) {
  let userId = store.userId;
  if(exam.examType === ExamType.GroupExam){
    const groupInfo = (await axios.get<Group[]>(`/user/groups/${store.userId}`,{
      params:{
        examId: examId.value
      }
    })).data;
    if(groupInfo.length>0) userId = groupInfo[0].id;
  }
  for (const problem of exam.problems) {
    axios.get<Commit[]>(`/Commit`, {
      params: {
        examId: exam.id,
        problemId: problem.id,
        userId: userId
      }
    })
      .then(({ data }) => {
        if (data.length > 0) {
          commitStatus.value[problem.id] = data[0];
        }
      })
  }
}

// const members = ref<User[]>([]);
// const score = ref<number>(0); // Example score value

onMounted(async () => {
  anime({
    targets: ".exam-commit-first-in",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  })
});
</script>

<style>
#exam-container {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}

#exam-wrapper {
  display: flex;
  flex-direction: row;
  height: calc(100% - 80px);
}

#exam-main {
  flex-grow: 1;
  padding: 20px;
  box-sizing: border-box;
}

#exam-commit-aside {
  width: 350px;
  padding: 20px;
  box-sizing: border-box;
  overflow: visible;
}

.exam-commit-header h1 {
  margin-left: 20px;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.exam-commit-left-column {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.exam-commit-right-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--bg-color-darker);
  box-shadow: var(--out-shadow);
  box-sizing: border-box;
  padding: 20px;
  border-radius: 20px;
}

.exam-commit-card {
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: var(--bg-color-darker);
}

.exam-commit-card:hover {
  cursor: pointer;
  transform: scale(1.03);
  filter: brightness(0.9);
}

.exam-commit-card:active {
  transform: scale(1);
  filter: brightness(1);
}

.exam-commit-status {
  text-wrap: wrap;
}

.exam-commit-number {
  font-size: 24px;
  font-weight: bold;
}

.completed {
  background-color: var(--question-completed-bg);
}

.exam-commit-score-card {
  flex-grow: 5;
  width: 100%;
  text-align: center;
}

.score-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.exam-commit-score-value {
  font-size: 48px;
  font-weight: bold;
}

.exam-commit-team-info {
  flex-grow: 5;
  width: 100%;
  text-align: center;
}

.exam-commit-team-info-title {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: left;
}

.exam-commit-inspect-dialog {
  padding: 20px;
}
</style>
