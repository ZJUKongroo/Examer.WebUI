<template>
  <v-container>
    <UniversalHeader title="参试人员管理" class="exam-candidate-header">
      <template #append>
        <v-btn>Save</v-btn>
      </template>
    </UniversalHeader>
    <div class="exam-candidate-flex-container">
      <div class="exam-candidate-list-container exam-candidate-content">
        <v-text-field v-model="searchQuery.candidates" label="Search candidates..." solo></v-text-field>
        <v-btn class="mb-4" @click="handleAllParticipate">全部添加</v-btn>
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 4" :key="n" />
        </template>
        <!-- Show actual content when loaded -->
        <template v-else>
          <v-list>
            <v-list-item v-for="(candidate,index) in filteredCandidates" :key="candidate.id">
              <v-list-item-content>
                <v-list-item-title>{{ candidate.name }}</v-list-item-title>
              </v-list-item-content>
              <template v-slot:append>
                <v-btn icon="mdi-plus" variant="plain" @click="handleParticipate(candidate,index)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </div>
      <div class="exam-candidate-selected-container exam-candidate-content">
        <v-text-field v-model="searchQuery.participants" label="Search participants..." solo></v-text-field>
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 3" :key="n" />
        </template>
        <!-- Show actual content when loaded -->
        <template v-else>
          <v-list>
            <v-list-item v-for="(participant,index) in filteredParticipants" :key="participant.id">
              <v-list-item-content>
                <v-list-item-title>{{ participant.name }}</v-list-item-title>
              </v-list-item-content>
              <template v-slot:append>
                <v-btn icon="mdi-minus" variant="plain" @click="handleCandidate(participant,index)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import anime from 'animejs';
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UniversalHeader from '~/components/UniversalHeader.vue';
import type { ExamType } from '~/enums';
import axios from '~/ts/request';
import type { User } from '~/types';

const route = useRoute();
const searchQuery = ref({
  participants: '',
  candidates: ''
});
const candidates = ref<User[]>([]);
const participants = ref<User[]>([]);
const examId = computed(() => route.query.id as string);

// New reactive loading flag
const loading = ref(true);

const filteredCandidates = computed(() => {
  return candidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.candidates.toLowerCase())
  );
});

const filteredParticipants = computed(() => {
  return participants.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.participants.toLowerCase())
  );
});

function handleParticipate(candidate: User,index:number) {
  axios.post(`/exam/assignment/${examId.value}`, [candidate.id]).then(()=>{
    participants.value.push(candidate); 
    candidates.value = candidates.value.splice(index,1);
    ElMessage.success("操作成功")
  });
}

function handleAllParticipate(){
  axios.post(`/exam/assignment/${examId.value}`, candidates.value.map(candidate => candidate.id)).then(()=>{
    participants.value = participants.value.concat(candidates.value);
    candidates.value = [];
    ElMessage.success("操作成功")
  });
}

function handleCandidate(participant: User,index:number) {
  axios.delete(`/exam/assignment/${examId.value}`, {
    data: [participant.id]
  }).then(()=>{
    candidates.value.push(participant);
    participants.value = participants.value.splice(index,1);
    ElMessage.success("操作成功")
  });
}

async function getAllUser() {
  const res = await axios.get<User[]>(`/user`);
  candidates.value = res.data;
}

async function getExamUser() {
  interface ExamUserResponse {
    id: string,
    name: string,
    examType: ExamType,
    startTime: string,
    endTime: string,
    users: string[]
  }
  const res = await axios.get<ExamUserResponse>(`/exam/users/${examId.value}`);
  const examUsers = new Set(res.data.users);
  participants.value = candidates.value.filter(candidate => examUsers.has(candidate.id));
  candidates.value = candidates.value.filter(candidate => !examUsers.has(candidate.id));
}

onMounted(async () => {
  anime({
    targets: '.exam-candidate-header',
    translateX: [20, 0],
    opacity: [0, 1],
  });
  anime({
    targets: '.exam-candidate-content',
    translateY: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  });

  loading.value = true;
  await getAllUser();
  await getExamUser();
  loading.value = false;
});
</script>

<style scoped>
.exam-candidate-flex-container {
  display: flex;
  gap: 20px;
}

.exam-candidate-list-container,
.exam-candidate-selected-container {
  flex: 1;
}
</style>
