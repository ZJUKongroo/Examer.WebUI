<template>
  <v-container>
    <UniversalHeader title="参试人员管理" class="exam-candidate-header">
      <template #append>
        <v-btn>Save</v-btn>
      </template>
    </UniversalHeader>
    <div class="exam-candidate-flex-container">
      <div class="exam-candidate-list-container exam-candidate-content">
        <v-text-field v-model="searchQuery" label="Search candidates..." solo></v-text-field>
        <v-btn @click="selectAllCandidates" class="mb-4">全选</v-btn>
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 4" :key="n" />
        </template>
        <!-- Show actual content when loaded -->
        <template v-else>
          <v-list>
            <v-list-item v-for="candidate in filteredCandidates" :key="candidate.id">
              <v-list-item-content>
                <v-list-item-title>{{ candidate.name }}</v-list-item-title>
              </v-list-item-content>
              <template v-slot:append>
                <v-btn icon="mdi-plus" variant="plain" @click="toggleCandidateSelection(candidate)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </div>
      <div class="exam-candidate-selected-container exam-candidate-content">
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 3" :key="n" />
        </template>
        <!-- Show actual content when loaded -->
        <template v-else>
          <v-list>
            <v-list-item v-for="candidate in filteredParticipants" :key="candidate.id"
              @click="toggleCandidateSelection(candidate)" :class="{ 'selected': isSelected(candidate) }">
              <v-list-item-content>
                <v-list-item-title>{{ candidate.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import anime from 'animejs';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UniversalHeader from '~/components/UniversalHeader.vue';
import type { ExamType } from '~/enums';
import axios from '~/ts/request';
import type { User } from '~/types';

const route = useRoute();
const searchQuery = ref('');
const selectedSearchQuery = ref('');
const candidates = ref<User[]>([]);
const participants = ref<User[]>([]);
const examId = computed(() => route.query.id as string);

// New reactive loading flag
const loading = ref(true);

const filteredCandidates = computed(() => {
  return candidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredParticipants = computed(() => {
  return participants.value.filter(candidate =>
    candidate.name.toLowerCase().includes(selectedSearchQuery.value.toLowerCase())
  );
});

const toggleCandidateSelection = (candidate: User) => {
  const index = participants.value.findIndex(c => c.id === candidate.id);
  if (index === -1) {
    participants.value.push(candidate);
    candidates.value = candidates.value.filter(c => c.id !== candidate.id);
  } else {
    candidates.value.push(candidate);
    participants.value.splice(index, 1);
  }
};

const isSelected = (candidate: User) => {
  return participants.value.some(c => c.id === candidate.id);
};

const selectAllCandidates = () => {
  participants.value = [...filteredCandidates.value];
  candidates.value = candidates.value.filter(candidate =>
    !filteredCandidates.value.includes(candidate)
  );
};

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

.selected {
  background-color: #e0e0e0;
}
</style>
