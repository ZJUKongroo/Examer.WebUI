<template>
  <div id="user-page">
    <div id="user-page-header">
      <div id="user-page-title">用户管理</div>
      <div id="user-page-subtitle">点击用户进入详情页进行查看或编辑</div>
    </div>

    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-table v-else id="user-page-table" density="compact">
      <thead>
        <tr>
          <th>姓名</th>
          <th>学号</th>
          <th>学院</th>
          <th>专业</th>
          <th>班级</th>
          <th>手机号</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in userList" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ u.studentNo }}</td>
          <td>{{ u.college }}</td>
          <td>{{ u.major }}</td>
          <td>{{ u.class }}</td>
          <td>{{ getPhone(u) }}</td>
          <td>
            <v-btn size="small" variant="text" @click="openDetail(u.id)">查看详情</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="d-flex justify-center mt-4" v-if="!loading">
      <v-pagination v-model="page" :length="totalPages" :total-visible="7" @update:model-value="fetchUserList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserDetailDto } from "~/types";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "~/ts/request";
import { ElMessage } from "element-plus";

type UserDetailRecord = UserDetailDto & {
  phoneNumber?: string;
};

const router = useRouter();
const loading = ref(false);
const page = ref(1);
const pageSize = 20;
const totalPages = ref(1);
const userList = ref<UserDetailRecord[]>([]);

function getPhone(user: UserDetailRecord): string {
  return user.phoneNumber ?? user.phoneNo ?? "—";
}

function openDetail(userId: string): void {
  router.push({ path: "/user/detail", query: { id: userId } });
}

async function fetchUserList(): Promise<void> {
  loading.value = true;
  try {
    const res = await axios.get("/user/detail", {
      params: { PageNumber: page.value, PageSize: pageSize },
    });
    const data: UserDetailRecord[] = res.data;
    userList.value = data;

    const total = Number(res.headers["x-total-count"] ?? res.headers["x-pagination-totalcount"] ?? 0);
    totalPages.value = total > 0 ? Math.ceil(total / pageSize) : data.length === pageSize ? page.value + 1 : page.value;
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "获取用户列表失败" });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchUserList();
});
</script>

<style lang="scss">
#user-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 20px;
}

#user-page-header {
  margin-bottom: 16px;
}

#user-page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-color);
}

#user-page-subtitle {
  margin-top: 4px;
  color: var(--text-color-tip);
}

#user-page-table {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--bd-color);
}
</style>
