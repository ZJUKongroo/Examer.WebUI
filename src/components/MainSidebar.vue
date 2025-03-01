<template>
  <div class="sidebar-main">
    <div class="sidebar-logo">
      <img v-if="store.isDarkMode" src="@/assets/img/logo-dark.png" alt="logo" />
      <img v-else src="@/assets/img/logo-light.png" alt="logo" />
    </div>
    <div class="sidebar-menu">
      <SidebarCell v-ripple v-for="option in options" :name="option.name" :iconClass="option.iconClass" @click="open(option.path)"></SidebarCell>
      <SidebarCell v-ripple name="退出" iconClass="mdi-exit-to-app" @click="store.logout()"></SidebarCell>
    </div>
    <div class="sidebar-exam">
      <template v-if="store.loading">
        <v-skeleton-loader  type="list-item-two-line" class="mb-4" v-for="n in 2" :key="n" />
      </template>
      <template v-else>
        <div v-if="exams.length===0">暂无考试</div>
        <ExamCell v-else v-ripple v-for="exam in exams" :info="exam" @click="open('/exam/commit',{
        id:exam.id
      })"></ExamCell>
      </template>
    </div>
    <SidebarFooter></SidebarFooter>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, } from 'vue';
import { useRouter } from 'vue-router';
import SidebarCell from './SidebarCell.vue';
import ExamCell from './ExamCell.vue';
import { useMainStore } from '~/store/mainStore';
import { entry } from '~/ts/entry';
import SidebarFooter from './SidebarFooter.vue';
import '~/style/sidebar.css';

const router = useRouter();
const store = useMainStore();
const options = ref([
  { name: '主页', iconClass: 'mdi-home',path:'/home' },
]);

const exams = computed(() => store.examData);

function open(path: string,query?:any) {
  router.push({
    path,
    query
  });
}

onMounted(()=>{
  const main = document.getElementById('sidebar-main');
  if(main) {
    entry('right',main, 50)
  }
})
</script>