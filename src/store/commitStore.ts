import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "~/ts/request";
import type { Commit } from "~/types";
import Loki from "lokijs";
import { ElMessage } from "element-plus";

export const useCommitStore = defineStore("commit", () => {
  // state
  const loading = ref(false);
  const db = new Loki("commit");
  const initialized = ref(false);

  async function fetchCommits() {
    loading.value = true;
    try {
      const { data } = await axios.get<Commit[]>("/commit");
      // 如果集合不存在，则添加集合并插入数据
      let commitCollection = db.getCollection<Commit>("commits");
      if (!commitCollection) {
        commitCollection = db.addCollection<Commit>("commits");
      } else {
        // 重新加载数据前清空集合
        commitCollection.clear();
      }
      commitCollection.insert(data);
    } catch (e) {
      ElMessage.error("获取提交数据失败");
    } finally {
      loading.value = false;
    }
  }

  async function queryExamCommit(
    examId: string,
    filters: {
      userName?: string;
      problemName?: string;
      status?: string;
    } = {}
  ) {
    if (!initialized.value && !loading.value) {
      await fetchCommits();
      initialized.value = true;
    }

    const commitCollection = db.getCollection<Commit>("commits");
    if (!commitCollection) {
      return [];
    }

    const query: any = { "exam.id": examId };
    if (filters.userName) query["user.name"] = filters.userName;
    if (filters.problemName) query["problem.name"] = filters.problemName;
    if (filters.status) {
      filters.status === "true"
        ? (query["markings"] = { $not: { $size: 0 } })
        : (query["markings"] = { $size: 0 });
    }
    return commitCollection.find(query);
  }

  async function queryCommitProblem(examId: string) {
    if (!initialized.value && !loading.value) {
      await fetchCommits();
      initialized.value = true;
    }

    const commitCollection = db.getCollection<Commit>("commits");
    if (!commitCollection) {
      return [];
    }

    const query: any = { "exam.id": examId };

    const problemName = commitCollection
      .find(query)
      .map((commit) => commit.problem.name);
    return problemName;
  }

  async function queryCommitUser(examId: string) {
    if (!initialized.value && !loading.value) {
      await fetchCommits();
      initialized.value = true;
    }

    const commitCollection = db.getCollection<Commit>("commits");
    if (!commitCollection) {
      return [];
    }

    const query: any = { "exam.id": examId };
    const userName = [
      ...new Set(
        commitCollection.find(query).map((commit) => commit.user.name)
      ),
    ];
    return userName;
  }

  return {
    loading,
    db,
    fetchCommits,
    queryExamCommit,
    queryCommitProblem,
    queryCommitUser,
  };
});
