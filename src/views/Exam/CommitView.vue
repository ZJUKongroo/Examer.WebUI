<template>
  <container id="exam-container">
    <header height="80px">
      <div class="header-content">
        <h1>考试名称</h1>
      </div>
    </header>
    <container id="exam-wrapper">
      <main id="exam-main">
        <div class="left-column">
          <div
            v-ripple
            @click="openProblem(exam)"
            v-for="(exam, index) in exams"
            :key="index"
            :class="['exam-card', { 'completed': exam.completed, 'not-completed': !exam.completed }]"
          >
            <div class="exam-number">试题 {{ exam.number }}</div>
            <div class="exam-status"> {{ exam.completed?"已经提交":"尚未提交" }}</div>
          </div>
        </div>
      </main>
      <aside id="exam-aside">
        <div class="right-column">
          <div class="team-info">
            <div class="team-info-title">队伍信息</div>
            <TeamCell v-ripple v-for="member in members" :info="member"/>
          </div>
          <div class="score-card">
            <div class="score-title">分数</div>
            <div class="score-value">{{ score }}</div>
          </div>
        </div>
      </aside>
    </container>
  </container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TeamCell from '~/components/TeamCell.vue';


const exams = ref([
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

function openProblem(exam: any) {
  router.push('/problem');
}

const members = ref([
  { name: '张三', phoneNumber: '1234567890', studentNumber: 'S001' },
  { name: '李四', phoneNumber: '0987654321', studentNumber: 'S002' },
  { name: '王五', phoneNumber: '1122334455', studentNumber: 'S003' },
  { name: '赵六', phoneNumber: '5566778899', studentNumber: 'S004' },
  // Add more member items as needed
]);

const score = ref(85); // Example score value
</script>

<style>
#exam-container {
  width: 100%;
  height: 100%;
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

#exam-aside {
  width: 350px;
  padding: 20px;
  box-sizing: border-box;
  overflow: visible;
}

.header-content {
  height: 100%;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  line-height: 80px;
}

.header-content h1{
  margin: 0;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.left-column {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.right-column {
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

.exam-card {
  width: 130px;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content:space-around;
  align-items: center;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  transition: .3s;
}

.exam-card:hover {
  cursor: pointer;
  transform: scale(1.03);
  filter: brightness(0.9);
}

.exam-card:active{
  transform: scale(1);
  filter: brightness(1);
}

.exam-number{
  font-size: 24px;
  font-weight: bold;
}

.completed {
  background-color: var(--question-completed-bg);
}

.not-completed {
  background-color: var(--bg-color-darker);
}

.score-card {
  flex-grow: 5;
  width: 100%;
  text-align: center;
}

.score-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.score-value {
  font-size: 48px;
  font-weight: bold;
}

.team-info {
  flex-grow: 5;
  width: 100%;
  text-align: center;
}
.team-info-title {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: left;
}
</style>