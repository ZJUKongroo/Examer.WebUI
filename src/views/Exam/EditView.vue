<template>
  <v-container>
    <div id="exam-edit-header">
      <h1>考试列表</h1>
      <v-btn variants="tonal" @click="createExam">新建考试</v-btn>
    </div>
    <div id="exam-edit-content">
      <div class="exam-edit-card" v-for="(exam, index) in exams" :key="exam.id">
        <v-card
          class="mb-2"
          link
          :title="`${exam.name}`"
          :subtitle="`${(new Date(exam.startTime+'Z')).toLocaleString()} - ${(new Date(exam.endTime+'Z')).toLocaleString()}`"
          @click="open('/problem/edit', { id: exam.id })"
        >
          <!-- <v-card-subtitle>{{ exam.description }}</v-card-subtitle> -->
          <template #append>
            <v-btn
              variants="plain"
              @click.stop="editGroup(index)"
              icon="mdi-text-box-edit-outline"
            />
            <v-btn
              color="error"
              class="ml-2"
              @click.stop="deleteExam(index)"
              icon="mdi-delete"
            />
          </template>
        </v-card>
      </div>
    </div>
  </v-container>
  <CDialog
    v-model:visible="examCreateVisible"
    title="新建考试"
    width="700px"
    height="500px"
  >
    <template #content>
      <div id="exam-create-dialog-container">
        <h1 class="mb-4">新建考试</h1>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="form.name"
            label="考试名称"
            required
          ></v-text-field>
          <v-menu
            v-model="menuStart"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="form.startTime"
                label="开始时间"
                readonly
                v-bind="props"
                append-inner-icon="mdi-calendar-clock"
                hint="选择开始时间"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.startTime"
              @input="menuStart = false"
              no-title
              scrollable
            ></v-date-picker>
          </v-menu>
          <v-menu
            v-model="menuEnd"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="form.endTime"
                label="结束时间"
                readonly
                v-bind="props"
                append-inner-icon="mdi-calendar-clock"
                hint="选择结束时间"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.endTime"
              @input="menuEnd = false"
              no-title
              scrollable
            ></v-date-picker>
          </v-menu>
          <v-btn variants="tonal" type="submit">提交</v-btn>
        </v-form>
      </div>
    </template>
  </CDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CDialog from "~/components/UI/CDialog.vue";
import { useMainStore } from "~/store/mainStore";
import deleteConfirm from "~/ts/deleteConfirm";
import anime from "animejs";
import axios from "~/ts/request";
import { ElMessage } from "element-plus";

const store = useMainStore();
const exams = computed(() => store.examData);
const router = useRouter();
const examCreateVisible = ref(false);

const form = ref({
  name: "",
  startTime: new Date(),
  endTime: new Date(),
});
const menuStart = ref(false);
const menuEnd = ref(false);

const submitForm = () => {
  const newExam = {
    name: form.value.name,
    startTime: form.value.startTime.toISOString(),
    endTime: form.value.endTime.toISOString(),
  };
  axios.post("/Exam", newExam).then(() => {
    store.refreshExamData();
    examCreateVisible.value = false;
    ElMessage.success("已新建考试");
    form.value = {
      name: "",
      startTime: new Date(),
      endTime: new Date(),
    };
  }).catch(() => {
    ElMessage.error("新建考试失败");
  });
};

const createExam = () => {
  examCreateVisible.value = true;
};

const deleteExam = (index: number) => {
  deleteConfirm("确认删除考试？", false).then((res) => {
    if (res) {
      axios.delete(`/Exam/${exams.value[index].id}`).then(() => {
        store.refreshExamData();
        ElMessage.success("已删除考试");
      }).catch(() => {
        ElMessage.error("删除考试失败");
      });
    }
  });
};

const editGroup = (index: number) => {
  open("/exam/group", { id: exams.value[index].id });
};

function open(path: string, query?: any) {
  router.push({
    path,
    query,
  });
}

onMounted(() => {
  anime({
    targets: "#exam-edit-header",
    opacity: [0, 1],
    translateX: [20, 0],
    loop: false,
    duration: 500,
  });
  anime({
    targets: ".exam-edit-card",
    opacity: [0, 1],
    translateY: [20, 0],
    loop: false,
    duration: 500,
    delay: anime.stagger(100),
  });
});
</script>

<style>
#exam-create-dialog-container {
  padding: 20px;
  box-sizing: border-box;
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
