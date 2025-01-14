<template>
  <div id="sidebar-main">
    <div id="sidebar-logo">
      <img v-if="store.isDarkMode" src="@/assets/img/logo-dark.png" alt="logo" />
      <img v-else src="@/assets/img/logo-light.png" alt="logo" />
    </div>
    <div id="sidebar-menu">
      <SidebarCell v-ripple v-for="option in options" :name="option.name" :iconClass="option.iconClass" @click="open(option.path)"></SidebarCell>
    </div>
    <div id="sidebar-exam">
      <ExamCell v-ripple v-for="exam in exams" :name="exam.name" @click="open(exam.path)"></ExamCell>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, } from 'vue';
import { useRouter } from 'vue-router';
import SidebarCell from './SidebarCell.vue';
import ExamCell from './ExamCell.vue';
import { useMainStore } from '~/store/mainStore';
import { entry } from '~/ts/entry';

const router = useRouter();
const store = useMainStore();
const options = ref([
  { name: 'Home', iconClass: 'el-icon-s-home',path:'home' },
  { name: 'Exam', iconClass: 'el-icon-s-order',path:'exam' },
  { name: 'Settings', iconClass: 'el-icon-s-tools',path:'settings' },
]);

const exams = ref([
  { name: '报名表', path:'home' },
  { name: '实践面', path:'exam' },
]);

function open(path: string) {
  router.push(path);
}

onMounted(()=>{
  const main = document.getElementById('sidebar-main');
  if(main) {
    entry('right',main, 50)
  }
})
</script>

<style scoped>
#sidebar-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  height: 100vh;
  background-color: var(--bg-color-shallow);
}

#sidebar-menu{
  padding: 20px;
  padding-bottom: 0;
  box-sizing: border-box;
  width: 100%;
}

#sidebar-exam{
  width: calc(100% - 40px);
  border-radius: 20px;
  margin: 20px;
  margin-top: 10px;
  padding: 13px;
  box-sizing: border-box;
  height: 100%;
  background-color: var(--bg-color-solid);
  box-shadow: var(--inset-shadow);
}

#sidebar-logo img{
  width: 100%;
  padding: 20%;
  padding-bottom: 0;
  box-sizing: border-box;
  text-align: center;
}
</style>