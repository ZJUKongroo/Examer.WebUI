<template>
  <div class="exam-candidate-container">
    <UniversalHeader title="参试人员管理" class="exam-candidate-header">
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
            <v-list-item v-for="(candidate, index) in pagedFilteredCandidates" :key="candidate.id">
              <v-list-item-content>
                <v-list-item-title>{{ candidate.name }}</v-list-item-title>
              </v-list-item-content>
              <template v-slot:append>
                <v-btn icon="mdi-plus" variant="plain" @click="handleParticipate(candidate, index)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-pagination v-model="currentPage.candidates" :length="totalPages.candidates" circle class="mt-4" />
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
            <v-list-item v-for="(participant, index) in pagedFilteredParticipants" :key="participant.id">
              <v-list-item-content>
                <v-list-item-title>{{ participant.name }}</v-list-item-title>
              </v-list-item-content>
              <template v-slot:append>
                <v-btn icon="mdi-minus" variant="plain" @click="handleCandidate(participant, index)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-pagination  v-model="currentPage.participants" :length="totalPages.participants" circle class="mt-4" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { animate, spring, stagger } from 'animejs';
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import UniversalHeader from '~/components/UniversalHeader.vue';
import { assignExamMembers, getExamUsers, getUsers, unassignExamMembers } from '~/api';
import { handleApiError } from '~/api/error';
import { fetchAllPaginatedItems } from '~/composables/usePagination';
import type { User } from '~/types';

const route = useRoute();
const searchQuery = ref({
  participants: '',
  candidates: ''
});
const currentPage = ref({
  participants: 1,
  candidates: 1
});
const candidates = ref<User[]>([]);
const participants = ref<User[]>([]);
const examId = computed(() => route.query.id as string);
const defaultPageSize = 10;
const loading = ref(true);

// 根据查询过滤用户
const filteredCandidates = computed(() => {
  return candidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.candidates.toLowerCase())
  )
});
const filteredParticipants = computed(() => {
  return participants.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.participants.toLowerCase())
  );
});

// 根据当前页数过滤查询后的用户
const pagedFilteredCandidates = computed(() => {
  return filteredCandidates.value.slice((currentPage.value.candidates - 1) * defaultPageSize, currentPage.value.candidates * defaultPageSize);
});
const pagedFilteredParticipants = computed(() => {
  return filteredParticipants.value.slice((currentPage.value.participants - 1) * defaultPageSize, currentPage.value.participants * defaultPageSize);
});

// 之所以不把查询和页数写一块是为了分页
const totalPages = computed(()=>{
  return {
    participants: Math.ceil(filteredParticipants.value.length / defaultPageSize),
    candidates: Math.ceil(filteredCandidates.value.length / defaultPageSize)
  }
});
// 非常繁复的代码 :(

// 添加参试人员
async function handleParticipate(candidate: User, index: number) {
  try {
    await assignExamMembers(examId.value, [candidate.id]);
    participants.value = participants.value.concat(candidates.value.splice(index, 1));
    ElMessage.success("操作成功");
  } catch (error) {
    handleApiError(error, { fallbackMessage: "操作失败" });
  }
}
// 添加所有参试人员
async function handleAllParticipate() {
  try {
    await assignExamMembers(examId.value, candidates.value.map(candidate => candidate.id));
    participants.value = participants.value.concat(candidates.value);
    candidates.value = [];
    ElMessage.success("操作成功");
  } catch (error) {
    handleApiError(error, { fallbackMessage: "操作失败" });
  }
}
// 删除参试人员
async function handleCandidate(participant: User, index: number) {
  try {
    await unassignExamMembers(examId.value, [participant.id]);
    candidates.value = candidates.value.concat(participants.value.splice(index, 1));
    ElMessage.success("操作成功");
  } catch (error) {
    handleApiError(error, { fallbackMessage: "操作失败" });
  }
}

async function getAllUser() {
  candidates.value = await fetchAllPaginatedItems(
    (pageSize) => getUsers({ pageNumber: 1, pageSize }),
    defaultPageSize
  );
}

async function getExamUser() {
  // 获取到的只有 Id，所以要根据所有用户的信息筛选
  const res = await getExamUsers(examId.value);
  const examUsers = new Set(res.data.users);
  participants.value = candidates.value.filter(candidate => examUsers.has(candidate.id));
  candidates.value = candidates.value.filter(candidate => !examUsers.has(candidate.id));
}

// 动画
onMounted(async () => {
  animate('.exam-candidate-header', {
    translateX: [20, 0],
    opacity: [0, 1],
    ease: spring(),
  });
  animate('.exam-candidate-content', {
    translateY: [20, 0],
    opacity: [0, 1],
    delay: stagger(50),
    ease: spring(),
  });

  loading.value = true;
  await getAllUser();
  await getExamUser();
  loading.value = false;
});
</script>

<style>
.exam-candidate-container {
  padding: 40px;
}

.exam-candidate-flex-container {
  display: flex;
  gap: 20px;
}

.exam-candidate-list-container,
.exam-candidate-selected-container {
  flex: 1;
}
</style>
