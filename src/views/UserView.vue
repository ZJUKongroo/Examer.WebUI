<template>
  <div id="user-page">
    <div id="user-page-header" class="user-page-animation">
      <div id="user-page-title">用户管理</div>
    </div>

    <div class="user-page-animation">
      <div v-if="loading" class="text-center py-6">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <v-table v-else id="user-page-table" density="compact">
        <thead>
          <tr>
            <th>姓名</th>
            <th>学号</th>
            <th>邮箱</th>
            <th>验证</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in userList" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.studentNumber }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.enabled ? '是' : '否' }}</td>
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
  </div>
</template>

<script lang="ts" setup>
import type { User } from "~/types";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserList } from "~/api/modules/user.api";
import { ElMessage } from "element-plus";
import { animate, spring, stagger } from "animejs";

const router = useRouter();
const loading = ref(false);
const page = ref(1);
const pageSize = 20;
const totalPages = ref(1);
const userList = ref<User[]>([]);

function openDetail(userId: string): void {
  router.push({ path: "/user/detail", query: { id: userId } });
}

async function fetchUserList(): Promise<void> {
  loading.value = true;
  try {
    const result = await getUserList({
      pageNumber: page.value,
      pageSize,
    });
    userList.value = result.items;
    totalPages.value = Math.ceil(result.pagination.totalCount / pageSize);
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "获取用户列表失败" });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchUserList();
  animate('.user-page-animation',{
    translateX: [30, 0],
    opacity: [0, 1],
    delay: stagger(80),
    ease: spring(),
  })
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
