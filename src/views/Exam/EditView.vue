<template>
  <div class="exam-edit-container">
    <div id="exam-edit-header">
      <h1>考试列表</h1>
      <v-btn variants="tonal" @click="createExam">新建考试</v-btn>
    </div>
    <div id="exam-edit-content">
      <div class="exam-edit-card" v-for="(exam, index) in exams" :key="exam.id">
        <v-card class="mb-2" :subtitle="`${new Date(exam.startTime).toLocaleString()} - ${new Date(
          exam.endTime
        ).toLocaleString()}`">
          <template v-slot:title>
            <div class="exam-group-group-title">
              <template v-if="editingExam !== exam.id">
                {{ exam.name }}
                <v-btn @click.stop="changeExamName(exam)" icon="mdi-pencil" variant="plain"></v-btn>
              </template>
              <template v-else>
                <v-text-field v-model="newName" placeholder="新考试名" persistent-hint density="compact" hint="输入新考试名，回车确认"
                  @keydown.enter="confirmChangeExamName(exam)">
                  <template #append-inner>
                    <v-btn variant="text" @click="editingExam = ''" icon="mdi-close" size="small" />
                  </template>
                </v-text-field>
              </template>
            </div>
          </template>
          <!-- <v-card-subtitle>{{ exam.description }}</v-card-subtitle> -->
          <template #append>
            <v-btn variants="plain" @click.stop="editExam(index, exam.examType)" icon="mdi-text-box-edit-outline"
              v-tooltip:top="'编辑考生'" />
            <v-btn color="error" class="ml-2" @click.stop="deleteExam(index)" icon="mdi-delete"
              v-tooltip:top="'删除考试'" />
            <v-btn variant="text" class="ml-2" @click.stop="open('/problem/edit', { id: exam.id })"
              icon="mdi-chevron-right" v-tooltip:top="'编辑题目'" />
          </template>
        </v-card>
      </div>
    </div>
  </div>
  <CDialog v-model:visible="examCreateVisible" title="新建考试" width="700px" height="600px">
    <template #content>
      <ExamCreateForm></ExamCreateForm>
    </template>
  </CDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CDialog from "~/components/UI/CDialog.vue";
import { useMainStore } from "~/store/mainStore";
import deleteConfirm from "~/ts/deleteConfirm";
import { animate, stagger } from "animejs";
import axios from "~/ts/request";
import { ElMessage } from "element-plus";
import { ExamType } from "~/enums/index";
import type { Exam } from "~/types";
import ExamCreateForm from "~/components/ExamCreateForm.vue";

const store = useMainStore();
const exams = computed(() => store.examData);
const router = useRouter();
const examCreateVisible = ref(false);
const editingExam = ref("");
const newName = ref("");

function changeExamName(exam: Exam) {
  newName.value = exam.name;
  editingExam.value = exam.id;
}

function confirmChangeExamName(exam: Exam) {
  axios
    .put(`/Exam/${exam.id}`, {
      name: newName.value,
      startTime: exam.startTime,
      endTime: exam.endTime,
    })
    .then(() => {
      store.refreshExamData();
      editingExam.value = "";
      ElMessage.success("已修改考试名");
    })
    .catch(() => {
      ElMessage.error("修改考试名失败");
    });
}

const createExam = () => {
  examCreateVisible.value = true;
};

const deleteExam = (index: number) => {
  deleteConfirm("确认删除考试？", false).then((res) => {
    if (res) {
      axios
        .delete(`/Exam/${exams.value[index].id}`)
        .then(() => {
          store.refreshExamData();
          ElMessage.success("已删除考试");
        })
        .catch(() => {
          ElMessage.error("删除考试失败");
        });
    }
  });
};

const editExam = (index: number, type: ExamType) => {
  if (type === ExamType.UserExam) {
    open("/exam/candidate", { id: exams.value[index].id });
  } else {
    open("/exam/group", { id: exams.value[index].id });
  }
};

function open(path: string, query?: any) {
  router.push({
    path,
    query,
  });
}

onMounted(() => {
  animate("#exam-edit-header", {
    opacity: [0, 1],
    translateX: [20, 0],
    loop: false,
  });
  animate(".exam-edit-card", {
    opacity: [0, 1],
    translateY: [20, 0],
    loop: false,
    delay: stagger(100),
  });
});
</script>

<style>
.exam-edit-container {
  padding: 40px;
}

#exam-edit-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

#exam-edit-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
