<template>
  <div class="exam-review-container">
    <UniversalHeader title="提交记录" class="exam-review-header"/>
    <div class="colbox exam-review-header" id="exam-review-filter">
      <v-autocomplete
        v-model="selectedOption.name"
        :items="options.name"
        label="题目"
        class="mb-4 exam-review-filter-item"
      ></v-autocomplete>
      <v-autocomplete
        v-model="selectedOption.viewer"
        :items="options.viewer"
        label="评卷人"
        class="mb-4 exam-review-filter-item"
      ></v-autocomplete>
      <v-select
        v-model="selectedOption.status"
        :items="options.status"
        label="评测状态"
        class="mb-4 exam-review-filter-item"
      >
      </v-select>
    </div>
    <div class="exam-review-results-container">
      <div
        class="exam-review-record-card mb-4"
        v-for="record in filteredRecords"
        :key="record.id"
      >
        <v-card
          :color="
            record.reviewed
              ? 'var(--question-completed-bg)'
              : 'var(--bg-color-shallow)'
          "
          :title="`ID ${record.id}`"
          :subtitle="`提交时间: ${record.time}`"
          link
          @click="openRecord(record)"
        >
          <template v-slot:append>
            <div>{{ record.score }}</div>
          </template>
          <v-card-text>
            <div>题目名称: {{ record.title }}</div>
            <div>评卷人: {{ record.reviewer }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { ref, computed, type Ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import UniversalHeader from "~/components/UniversalHeader.vue";
import axios from '~/ts/request';

type OptionKeys = "name" | "viewer" | "status";
interface Records {
  id: number;
  title: string;
  score: number;
  reviewer: string;
  reviewed: boolean;
  time: string;
}
const router = useRouter();
const route = useRoute();
const examId = computed(() => route.query.id as string);

const options: Ref<Record<OptionKeys, string[]>> = ref({
  name: ["All", "1", "2", "3"],
  viewer: ["All", "张三", "李四", "王五"],
  status: ["All", "Reviewed", "Not Reviewed"],
});
const selectedOption: Ref<Record<OptionKeys, string>> = ref({
  name: "All",
  viewer: "All",
  status: "All",
});

const records: Ref<Records[]> = ref([
  {
    id: 1,
    title: "题目 1",
    score: 85,
    reviewer: "张三",
    reviewed: true,
    time: "2023-10-01 10:00",
  },
  {
    id: 2,
    title: "题目 2",
    score: 90,
    reviewer: "李四",
    reviewed: false,
    time: "2023-10-02 11:00",
  },
  {
    id: 3,
    title: "题目 3",
    score: 75,
    reviewer: "王五",
    reviewed: true,
    time: "2023-10-03 12:00",
  },
]);

function openRecord(record: Records) {
  router.push({
    path: "/problem/review",
    query: {
      id: record.id,
    },
  });
}

const filteredRecords = computed(() => {
  if (selectedOption.value.status === "Reviewed") {
    return records.value.filter((record) => record.reviewed);
  } else if (selectedOption.value.status === "Not Reviewed") {
    return records.value.filter((record) => !record.reviewed);
  } else {
    return records.value;
  }
});

function getExamCommits() {
  // Fetch exam commits from the server
  axios.get('/commit').then((response) => {
    console.log(response.data)
  });
}

onMounted(()=>{
  getExamCommits();
  anime({
    targets: ".exam-review-header",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  });
  anime({
    targets: ".exam-review-record-card",
    translateY: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  });
})
</script>

<style>
.exam-review-container{
  padding: 40px;
}
#exam-review-filter {
  margin-top: 10px;
}
.exam-review-filter-item {
  margin-right: 10px;
}
.exam-review-results-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

.exam-review-record-card {
  width: calc(33% - 20px);
}

.not-reviewed {
  background-color: #f8d7da;
}
</style>
