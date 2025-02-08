<template>
  <div id="exam-container">
    <UniversalHeader title="考试名称" class="exam-commit-header exam-commit-first-in"/>
    <container id="exam-wrapper">
      <main id="exam-main">
        <div class="exam-commit-left-column">
          <div
            v-ripple
            @click="openProblem(exam)"
            v-for="(exam, index) in problems"
            :key="index"
            :class="[
              'exam-commit-card',
              { completed: exam.completed, 'not-completed': !exam.completed },
            ]"
          >
            <div class="exam-commit-number">试题 {{ exam.number }}</div>
            <div class="exam-commit-status">
              {{ exam.completed ? "已经提交" : "尚未提交" }}
            </div>
          </div>
        </div>
      </main>
      <aside id="exam-commit-aside" class="exam-commit-first-in">
        <div class="exam-commit-right-column">
          <div class="exam-commit-team-info">
            <div class="exam-commit-team-info-title">队伍信息</div>
            <TeamCell v-ripple v-for="member in members" :info="member" />
          </div>
          <div class="exam-commit-score-card">
            <div class="exam-commit-score-title">分数</div>
            <div class="exam-commit-score-value">{{ score }}</div>
          </div>
        </div>
      </aside>
    </container>
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TeamCell from "~/components/TeamCell.vue";

const problems = ref([
  { number: 1, completed: true },
  { number: 2, completed: false },
  { number: 3, completed: true },
  { number: 4, completed: false },
  { number: 5, completed: false },
  { number: 6, completed: true },
  { number: 7, completed: false },
  // Add more exam items as needed
]);

const router = useRouter();

function openProblem(problem: any) {
  router.push({
    path: "/problem/commit",
    query: {
      id: problem.number,
    },
  });
}

const members = ref([
  { name: "张三", phoneNumber: "1234567890", studentNumber: "S001" },
  { name: "李四", phoneNumber: "0987654321", studentNumber: "S002" },
  { name: "王五", phoneNumber: "1122334455", studentNumber: "S003" },
  { name: "赵六", phoneNumber: "5566778899", studentNumber: "S004" },
  // Add more member items as needed
]);

const score = ref(85); // Example score value

onMounted(() => {
  anime({
    targets: ".exam-commit-first-in",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  })
  anime({
    targets: ".exam-commit-card",
    translateY: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(50,{
      start:250
    }),
  });
});
</script>

<style>
#exam-container {
  width: 100%;
  height: 100%;
  padding: 20px;
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

.exam-commit-header {
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  line-height: 80px;
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
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  box-sizing: border-box;
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

.exam-commit-number {
  font-size: 24px;
  font-weight: bold;
}

.completed {
  background-color: var(--question-completed-bg);
}

.not-completed {
  background-color: var(--bg-color-darker);
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
</style>
