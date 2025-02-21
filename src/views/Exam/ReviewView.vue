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
        v-for="commit in commits"
        :key="commit.id"
      >
        <v-card
          :color="
            commit.markings.length > 0
              ? 'var(--question-completed-bg)'
              : 'var(--bg-color-shallow)'
          "
          :title="`ID ${commit.id}`"
          :subtitle="`提交时间: ${new Date(commit.commitTime).toLocaleString()}`"
          link
          @click="openCommit(commit)"
        >
          <template v-slot:append>
            <div>{{ commit.markings.map((marking=>marking.score)) }}</div>
          </template>
          <v-card-text>
            <div>题目名称: {{ commit.problem.name }}</div>
            <!-- <div>评卷人: {{ commit.reviewer }}</div> -->
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { ref, computed, type Ref, onMounted, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import UniversalHeader from "~/components/UniversalHeader.vue";
import { useCommitStore } from "~/store/commitStore";
import type { Commit } from "~/types";

type OptionKeys = "name" | "viewer" | "status";
const router = useRouter();
const route = useRoute();
const examId = computed(() => route.query.id as string);
const commitStore = useCommitStore();

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

const commits = ref<Commit[]>([]);

watchEffect(async ()=>{
  const query = {
    userName:selectedOption.value.viewer==="All"?undefined:selectedOption.value.viewer,
    problemName:selectedOption.value.name==="All"?undefined:selectedOption.value.name,
  }
  commits.value = await commitStore.queryExamCommit(examId.value,query);
  nextTick(()=>init());
})

function openCommit(commit: Commit) {
  router.push({
    path: "/problem/review",
    query: {
      id: commit.id,
    },
  });
}

function init() {
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
}

onMounted(()=>init())
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
