<template>
  <v-container>
    <h1>提交记录</h1>
    <div class="colbox" id="review-filter">
      <v-autocomplete
        v-model="selectedOption.name"
        :items="options.name"
        label="题目"
        class="mb-4 review-filter-item"
      ></v-autocomplete>
      <v-autocomplete
        v-model="selectedOption.viewer"
        :items="options.viewer"
        label="评卷人"
        class="mb-4 review-filter-item"
      ></v-autocomplete>
      <v-select
        v-model="selectedOption.status"
        :items="options.status"
        label="评测状态"
        class="mb-4 review-filter-item"
      >
      </v-select>
    </div>
    <div class="review-results-container">
      <v-card
        v-for="record in filteredRecords"
        :key="record.id"
        :color="record.reviewed ? 'var(--question-completed-bg)' : 'var(--bg-color-shallow)'"
        class="mb-4 review-record-card"
        :title="`ID ${record.id}`"
        :subtitle="`提交时间: ${record.time}`"
        link
        @click="openRecord(record)"
      >
        <template v-slot:append>
          <v-text>{{ record.score }}</v-text>
        </template>
        <v-card-text>
          <div class="record-subtitle">题目名称: {{ record.title }}</div>
          <div class="record-subtitle">评卷人: {{ record.reviewer }}</div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from "vue";
import { useRouter } from "vue-router";

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
    path:'/problem/review',
    query: {
      id: record.id,
    },
  })
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
</script>

<style>
#review-filter {
  margin-top: 10px;
}
.review-filter-item {
  margin-right: 10px;
}
.review-results-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.review-record-card {
  width: calc(30% - 10px);
  margin-right: 10px;
  margin-bottom: 10px;
}

.not-reviewed {
  background-color: #f8d7da;
}
</style>
