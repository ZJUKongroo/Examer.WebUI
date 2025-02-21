<template>
  <div class="exam-review-container">
    <UniversalHeader title="提交记录" class="exam-review-header" />
    <div class="colbox exam-review-header" id="exam-review-filter">
      <v-autocomplete v-model="selectedOption.problemName" :items="options.problemName" label="题目"
        class="mb-4 exam-review-filter-item"></v-autocomplete>
      <v-autocomplete v-model="selectedOption.userName" :items="options.userName" label="考生"
        class="mb-4 exam-review-filter-item"></v-autocomplete>
      <v-select return-object v-model="selectedOption.status" :items="options.status" item-title="label"
        item-value="val" label="评测状态" class="mb-4 exam-review-filter-item">
      </v-select>
    </div>
    <div class="exam-review-results-container">
      <div class="exam-review-record-card mb-4" v-for="commit in commits" :key="commit.id">
        <v-card :color="commit.markings.length > 0
          ? 'var(--question-completed-bg)'
          : 'var(--bg-color-shallow)'
          " :title="`ID ${commit.id}`" :subtitle="`提交时间: ${new Date(commit.commitTime).toLocaleString()}`" link
          @click="openCommit(commit)">
          <template v-slot:append>
            <div v-if="commit.markings.length>0">{{commit.markings.map((marking => marking.score))}}</div>
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
import { ref, computed, type Ref, onMounted, watchEffect, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import UniversalHeader from "~/components/UniversalHeader.vue";
import { useCommitStore } from "~/store/commitStore";
import type { Commit } from "~/types";

type OptionKeys = "userName" | "problemName" | "status";
interface SelectOption {
  label: string;
  val: string;
}

const router = useRouter();
const route = useRoute();
const examId = computed(() => route.query.id as string);
const commitStore = useCommitStore();

const options: Ref<Record<OptionKeys, string[] | SelectOption[]>> = ref({
  userName: ["All"],
  problemName: ["All"],
  status: [
    { label: "All", val: "All" },
    { label: "已评测", val: "true" },
    { label: "未评测", val: "false" }
  ],
});
const selectedOption: Ref<Record<OptionKeys, any>> = ref({
  userName: "All",
  problemName: "All",
  status: { label: "All", val: "All" },
});

const commits = ref<Commit[]>([]);

watch(examId, (id) => init(id))

watch(selectedOption, async () => {
  const query = {
    userName: selectedOption.value.userName === "All" ? undefined : selectedOption.value.userName,
    problemName: selectedOption.value.problemName === "All" ? undefined : selectedOption.value.problemName,
    status: selectedOption.value.status.val === 'All' ? undefined : selectedOption.value.status.val,
  }
  commits.value = await commitStore.queryExamCommit(examId.value, query);
  nextTick(() => {
    anime({
      targets: ".exam-review-record-card",
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
    });
  })
}, { deep: true });

function openCommit(commit: Commit) {
  router.push({
    path: "/problem/review",
    query: {
      id: commit.id,
    },
  });
}

async function init(id: string) {
  selectedOption.value = {
    userName: "All",
    problemName: "All",
    status: "All",
  }
  anime({
    targets: ".exam-review-header",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  });
  commits.value = await commitStore.queryExamCommit(id);
  await Promise.all([
    (async () => {
      options.value.userName = ["All", ...await commitStore.queryCommitUser(id)];
    })(),
    (async () => {
      options.value.problemName = ["All", ...await commitStore.queryCommitProblem(id)];
    })()
  ])
  nextTick(() => {
    anime({
      targets: ".exam-review-record-card",
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
    });
  })
}

onMounted(() => init(examId.value));
</script>

<style>
.exam-review-container {
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
