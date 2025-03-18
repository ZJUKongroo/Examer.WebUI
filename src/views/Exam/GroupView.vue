<template>
  <div class="exam-group-container">
    <UniversalHeader title="分组管理" class="exam-group-header exam-group-view-anime" />
    <div class="exam-group-flex-container">
      <template v-if="loading">
        <div class="exam-group-skeleton">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 3" :key="n" />
        </div>
      </template>
      <template v-else>
        <div class="exam-group-users-container">
          <v-btn class="mb-4 mr-4" @click="autoGroupFormVisible = true">自动分组</v-btn>
          <v-btn class="mb-4" @click="importGroupsFromFile">导入分组</v-btn>
          <v-text-field v-model="searchQuery.user" label="Search user..." solo></v-text-field>
          <div class="exam-group-undistributed-card">
            <v-card title="等待分配的用户" @dragover.prevent="draggingOver = 'undistributed'"
              :class="{ 'exam-group-dragging': draggingOver === 'undistributed' }" @drop="onDropUndistributed">
              <v-card-text>
                <v-card v-for="user in paginatedFilteredUsers" :key="user.id" class="exam-group-user-card"
                  draggable="true" @dragstart="onDragStart(user)" variant="tonal">
                  <v-card-title>{{ user.name }}</v-card-title>
                </v-card>
              </v-card-text>
            </v-card>
          </div>
          <v-pagination v-model="currentPage.user" :length="totalPages.user" circle class="mt-4" />
        </div>
      </template>

      <div class="exam-group-divider"></div>

      <template v-if="loading">
        <div class="exam-group-skeleton">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 5" :key="n" />
        </div>
      </template>
      <template v-else>
        <div class="exam-group-groups-container">
          <v-text-field v-model="searchQuery.group" label="Search group..." solo></v-text-field>
          <div class="exam-group-groups">
            <div v-if="currentPage.group === 1" class="exam-group-new-zone" @drop.prevent="handleNewGroup"
              @dragover.prevent="draggingOver = 'new'" @dragleave.prevent="draggingOver = ''"
              :class="{ 'exam-group-dragging': draggingOver === 'new' }">
              <p>放下以新建组</p>
            </div>
            <v-card v-for="group in paginatedFilteredExamGroup" :key="group.id" class="exam-group-group-card"
              :class="{ 'exam-group-dragging': draggingOver === group.id }" @dragover.prevent="draggingOver = group.id"
              @dragleave.prevent="draggingOver = ''" @drop="onDrop(group)">
              <template v-slot:title>
                <div class="exam-group-group-title">
                  <template v-if="editingGroup !== group.id">
                    {{ group.name }}
                  </template>
                  <template v-else>
                    <v-text-field v-model="newName" placeholder="新组名" persistent-hint density="compact"
                      hint="输入新组名，回车确认" @keydown.enter="confirmChangeGroupName(group.id)">
                      <template #append-inner>
                        <v-btn variant="text" @click="editingGroup = ''" icon="mdi-close" size="small" />
                      </template>
                    </v-text-field>
                  </template>
                </div>
              </template>
              <template v-slot:append>
                <v-btn @click="changeGroupName(group.id)" icon="mdi-text-box-edit-outline" variant="tonal" class="mr-2"
                  size="small"></v-btn>
                <v-btn @click="deleteGroup(group.id)" icon="mdi-delete" variant="tonal" size="small"></v-btn>
              </template>
              <v-card-text>
                <v-card v-for="member in group.users" :key="member.id" class="exam-group-user-card" draggable="true"
                  @dragstart="onDragStart(member, group)" variant="tonal">
                  <v-card-title>{{ member.name }}</v-card-title>
                </v-card>
              </v-card-text>
            </v-card>
          </div>
          <v-pagination v-model="currentPage.group" :length="totalPages.group" circle class="mt-4" />
        </div>
      </template>
    </div>
  </div>
  <CDialog v-model:visible="autoGroupFormVisible" title="自动分组" width="600px" height="450px">
    <template #content>
      <div style="padding: 20px;">
        <template v-if="autoGroupingStatus.total === 0">
          <h1 class="mb-4">自动分组</h1>
          <v-form
            @submit.prevent="handleAutoGroup(autoGroupForm.groupSize, autoGroupForm.nameFormat, autoGroupForm.force)">
            <v-text-field v-model="autoGroupForm.groupSize" label="组大小" type="number" required></v-text-field>
            <v-text-field v-model="autoGroupForm.nameFormat" label="组名" hint="%number% 代表序号" required></v-text-field>
            <v-switch v-model="autoGroupForm.force" :true-value="true" :false-value="false">
              <template #prepend>
                <span>强制分组</span>
              </template>
            </v-switch>
            <v-btn variants="tonal" type="submit">提交</v-btn>
          </v-form>
        </template>
        <template v-else>
          <h1 class="mb-4">自动分组中</h1>
          <v-progress-linear :model-value="(autoGroupingStatus.current / autoGroupingStatus.total) * 100" height="10"
            class="mb-4"></v-progress-linear>
          <p>当前进度：{{ autoGroupingStatus.current }} / {{ autoGroupingStatus.total }}</p>
        </template>
      </div>
    </template>
  </CDialog>
  <CDialog v-model:visible="importGroupVisible" title="导入分组" width="600px" height="450px">
    <template #content>
      <div style="padding: 20px;">
        <h1 class="mb-4">导入分组中</h1>
        <v-progress-linear :model-value="(importStatus.current / importStatus.total) * 100" height="10"
          class="mb-4"></v-progress-linear>
        <p>当前进度：{{ importStatus.current }} / {{ importStatus.total }}</p>
      </div>
    </template>
  </CDialog>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { ElMessage } from "element-plus";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CDialog from "~/components/UI/CDialog.vue";
import UniversalHeader from "~/components/UniversalHeader.vue";
import type { ExamType } from "~/enums";
import axios from '~/ts/request';
import type { Group, Pagination, User } from '~/types';

const users = ref<User[]>([]);
const groups = ref<Group[]>([]);
const examGroup = ref<Group[]>([]);
const loading = ref(false);

const draggingInfo = ref<{
  user: User;
  from?: Group;
} | null>(null);
const draggingOver = ref("");
const editingGroup = ref<string>("");
const newName = ref<string>("");
const route = useRoute();
const examId = computed(() => route.query.id as string);

const defaultPageSize = 10;
const defaultGroupPageSize = 3;

const autoGroupForm = ref({
  groupSize: 4,
  nameFormat: "组-%number%",
  force: false
});
const autoGroupFormVisible = ref(false);
const autoGroupingStatus = ref({
  current: 0,
  total: 0
})

const importGroupVisible = ref(false);
const importStatus = ref({
  total: 0,
  current: 0
});

const onDragStart = (user: User, from?: Group) => {
  draggingInfo.value = {
    user,
    from,
  };
};

const searchQuery = ref({
  user: "",
  group: ""
});

// 1. 对未分配用户进行搜索与分页
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.user.toLowerCase())
  );
});
const filteredExamGroups = computed(() => {
  return examGroup.value.filter(group =>
    group.name.toLowerCase().includes(searchQuery.value.group.toLowerCase())
  );
});

const paginatedFilteredUsers = computed(() => {
  const start = (currentPage.value.user - 1) * defaultPageSize;
  return filteredUsers.value.slice(start, start + defaultPageSize);
});
const paginatedFilteredExamGroup = computed(() => {
  const start = (currentPage.value.group - 1) * defaultGroupPageSize;
  return filteredExamGroups.value.slice(start, start + defaultGroupPageSize);
});

const currentPage = ref({
  user: 1,
  group: 1
});

// 总页数计算
const totalPages = computed(() => ({
  user: Math.ceil(filteredUsers.value.length / defaultPageSize),
  group: Math.ceil(filteredExamGroups.value.length / defaultGroupPageSize)
}));

const onDrop = async (group: Group) => {
  const user = draggingInfo.value?.user;
  const from = draggingInfo.value?.from;
  if (user && from?.id !== group.id) {
    try {
      if (from) {
        await axios.delete(`/group/distribution/${from.id}`, {
          data: [user.id]
        }); // Remove from Group
        from.users = from.users.filter((u) => u.id !== user.id);
      }
      else users.value = users.value.filter((u) => u.id !== user.id);
      group.users.push(user);
      await axios.post(`/group/distribution/${group.id}`, [user.id]); // Assign to Group
    }
    catch (error) {
      ElMessage.error("分配组失败");
    }
  }
  draggingInfo.value = null;
  draggingOver.value = "";
};

const onDropUndistributed = async () => {
  const user = draggingInfo.value?.user;
  const from = draggingInfo.value?.from;
  if (user && from) {
    try {
      users.value.push(user);
      await axios.delete(`/group/distribution/${from.id}`, {
        data: [user.id]
      }); // Remove from Group
      from.users = from.users.filter((u) => u.id !== user.id);
    }
    catch (error) {
      ElMessage.error("移出组失败");
    }
  }
  draggingInfo.value = null;
  draggingOver.value = "";
};

const handleNewGroup = async () => {
  const user = draggingInfo.value?.user;
  const from = draggingInfo.value?.from;

  if (!user) {
    draggingInfo.value = null;
    draggingOver.value = "";
    return;
  }

  try {
    let createdGroupId = null;

    // 1. 如果用户来自某个组，先从原组移除
    if (from) {
      await axios.delete(`/group/distribution/${from.id}`, { data: [user.id] });
      from.users = from.users.filter(u => u.id !== user.id);
    }

    // 更新本地用户列表（先暂存以便出错时恢复）
    const userIndex = users.value.findIndex(u => u.id === user.id);
    const removedUser = users.value.splice(userIndex, 1)[0];

    try {
      // 2. 创建新组
      const { data } = await axios.post<Group>(`/group`, {
        name: "新组",
        description: ""
      });
      createdGroupId = data.id;

      // 3. 分配用户到新组
      await axios.post(`/group/distribution/${data.id}`, [user.id]);

      // 4. 分配组到考试
      await axios.post(`/exam/assignment/${examId.value}`, [data.id]);

      // 5. 更新UI状态
      data.users.push(user);
      examGroup.value.push(data);

      ElMessage.success("新建组成功");
    } catch (error) {
      // 恢复本地状态
      if (removedUser) {
        users.value.push(removedUser);
      }

      // 尝试清理失败的组
      if (createdGroupId) {
        try {
          await axios.delete(`/group/${createdGroupId}`);
        } catch (cleanupError) {
          console.error("清理失败组时出错:", cleanupError);
        }
      }

      throw error; // 向上传递错误
    }
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("新建组失败");
  } finally {
    // 无论成功失败都清理拖拽状态
    draggingInfo.value = null;
    draggingOver.value = "";
  }
};

/**
 * 从JSON文件导入分组数据
 * 文件格式应为：
 * {
 *   "组名1": ["成员名1", "成员名2", ...],
 *   "组名2": ["成员名1", "成员名2", ...]
 * }
 */
const importGroupsFromFile = async () => {
  type DataFormat = {
    [GroupName: string]: string[]
  }
  // 创建文件选择器
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const FailName: string[] = [];

    try {
      // 读取文件内容
      const fileContent = await file.text();
      const groupData: DataFormat = JSON.parse(fileContent);

      // 检查数据格式
      if (typeof groupData !== 'object' || groupData === null) {
        ElMessage.error("无效的JSON格式");
        return;
      }

      importStatus.value = {
        total: Object.keys(groupData).length,
        current: 0
      };
      importGroupVisible.value = true;

      const createdGroups: Group[] = [];
      for (const [groupName, memberNames] of Object.entries<string[]>(groupData)) {
        let newGroup: Group | null = null;
        try {
          // 1. 创建新组
          const { data } = await axios.post<Group>('/group', {
            name: groupName,
            description: ""
          });
          newGroup = data;

          // 2. 匹配用户名到用户ID
          const member = memberNames.map(name => {
            const user = users.value.find(u => u.name === name);
            if (user) {
              return user;
            }
            else {
              FailName.push(name);
              return null;
            };
          }).filter(Boolean) as User[];

          if (member.length > 0) {
            // 3. 分配用户到新组
            const memberId = member.map(user => user.id);
            await axios.post(`/group/distribution/${newGroup.id}`, memberId);
            newGroup.users = member;
            createdGroups.push(newGroup);
            // 从未分配列表移除
            users.value = users.value.filter(user => !memberId.includes(user.id));
          }

          importStatus.value.current++;
        } catch (error) {
          if (newGroup) {
            // 清理失败的组
            await axios.delete(`/group/${newGroup.id}`);
          }
          console.error(`创建组 "${groupName}" 失败:`, error);
        }
      }
      await axios.post(`/exam/assignment/${examId.value}`, createdGroups.map(group => group.id));
      examGroup.value = examGroup.value.concat(createdGroups);

      ElMessage.success(`成功导入 ${importStatus.value.current} 个分组`);
    } catch (error) {
      console.error('导入分组失败:', error);
      ElMessage.error(`导入分组失败，找不到 ${FailName}`);
    }
  };

  // 触发文件选择器
  input.click();
};

/**
 * 自动分组函数
 *
 * 根据指定的每组人数(groupSize)将未分配的用户自动分入多个分组，并将每个分组与考试关联。
 *
 * @param groupSize - 每组的用户数量
 * @param nameFormat - 分组名称格式，需包含占位符 '%number%'（例如："分组-%number%"）
 * @param force - 是否强制自动分组。当未分配用户数量不能整除时，若 force 为 true，则保留多余用户；否则发生错误。
 */
async function handleAutoGroup(groupSize: number, nameFormat: string, force = false) {
  if (users.value.length % groupSize !== 0 && !force) {
    ElMessage.error("未分配的用户数量不能被指定的组大小整除");
    return;
  }

  const numberOfGroups = Math.floor(users.value.length / groupSize);
  autoGroupingStatus.value = {
    current: 0,
    total: numberOfGroups
  };
  const newGroups: Group[] = [];

  try {
    const groupPromises = Array.from({ length: numberOfGroups }, async (_, i) => {
      const groupUsers = users.value.slice(i * groupSize, (i + 1) * groupSize);
      const groupName = nameFormat.replace('%number%', (i + 1).toString());
      const { data } = await axios.post<Group>(`/group`, {
        name: groupName,
        description: ""
      });
      await axios.post(`/group/distribution/${data.id}`, groupUsers.map(user => user.id));
      await axios.post(`/exam/assignment/${examId.value}`, [data.id]);
      data.users = groupUsers;
      newGroups.push(data);
      autoGroupingStatus.value.current++;
    });

    await Promise.all(groupPromises);

    examGroup.value.push(...newGroups);
    if (!force) {
      users.value = [];
    } else {
      users.value = users.value.slice(numberOfGroups * groupSize);
    }
    autoGroupingStatus.value = {
      current: 0,
      total: 0
    };
    autoGroupFormVisible.value = false;
    ElMessage.success("自动分组成功");
  } catch (error) {
    ElMessage.error("新建组失败");
  }
}


const deleteGroup = (id: string) => {
  const groupIndex = examGroup.value.findIndex((group) => group.id === id);
  const [group] = examGroup.value.splice(groupIndex, 1);
  if (group) {
    axios.delete(`/group/${group.id}`).then(() => {
      users.value = users.value.concat(group.users);
      ElMessage.success("删除组成功");
    }).catch(() => {
      ElMessage.error("删除组失败");
    });
  }
};

const changeGroupName = (id: string) => {
  const group = examGroup.value.find((group) => group.id === id);
  if (group) {
    newName.value = group.name;
    editingGroup.value = id;
  }
};

const confirmChangeGroupName = async (id: string) => {
  const group = examGroup.value.find((group) => group.id === id)
  if (group) try {
    await axios.put(`/group/${group.id}`, {
      name: newName.value,
      description: null
    });
    group.name = newName.value;
    editingGroup.value = "";
    ElMessage.success("修改组名成功");
  }
    catch (error) {
      ElMessage.error("修改组名失败");
    }
};

async function getAllUser() {
  let res = await axios.get<User[]>(`/user`, {
    params: {
      pagenumber: 1,
      pagesize: defaultPageSize
    }
  });
  const pagination: Pagination = JSON.parse(res.headers['x-pagination']);
  // 后端的分页不能清除
  // 先用小的分页大小获取totalCount, 再获取所有用户
  if (pagination.totalCount > defaultPageSize) {
    res = await axios.get<User[]>(`/user`, {
      params: {
        pagenumber: 1,
        pagesize: pagination.totalCount
      }
    });
  }
  users.value = res.data;
}

async function getAllGroup() {
  let res = await axios.get<Group[]>(`/group`, {
    params: {
      pagenumber: 1,
      pagesize: defaultPageSize
    }
  });
  const pagination: Pagination = JSON.parse(res.headers['x-pagination']);
  // 后端的分页不能清除
  // 先用小的分页大小获取totalCount, 再获取所有组
  if (pagination.totalCount > defaultPageSize) {
    res = await axios.get<Group[]>(`/group`, {
      params: {
        pagenumber: 1,
        pagesize: pagination.totalCount
      }
    });
  }
  groups.value = res.data;
}
// 上面的都是非常低效的代码，前后端一定要做好沟通！

async function getExamGroup() {
  interface ExamGroupResponse {
    id: string,
    name: string,
    examType: ExamType,
    startTime: string,
    endTime: string,
    users: string[]
  }
  const res = await axios.get<ExamGroupResponse>(`/exam/groups/${examId.value.trim()}`);
  examGroup.value = groups.value.filter(group =>
    res.data.users.includes(group.id)
  );
  const examGroupUsers = new Set(examGroup.value.flatMap(group => group.users.map(member => member.id)));
  users.value = users.value.filter(user => !examGroupUsers.has(user.id));
}

onMounted(async () => {
  anime({
    targets: '.exam-group-view-anime',
    translateX: [20, 0],
    opacity: [0, 1],
  })
  loading.value = true;
  await Promise.all([getAllUser(), getAllGroup()]);
  await getExamGroup();
  loading.value = false;
  nextTick(() => {
    anime({
      targets: '.exam-group-users-container',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
    })
    anime({
      targets: '.exam-group-groups-container',
      translateX: [-20, 0],
      opacity: [0, 1],
      delay: 200
    })
  })
})
</script>

<style>
.exam-group-container {
  padding: 40px;
}

.exam-group-flex-container {
  display: flex;
  gap: 20px;
}

.exam-group-users-container {
  flex-grow: 2;
}

.exam-group-groups-container {
  flex-grow: 3;
  box-sizing: border-box;
}

.exam-group-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  box-sizing: border-box;
}

.exam-group-user-card,
.exam-group-group-card {
  margin-bottom: 10px;
  padding: 10px;
  transition: background-color 0.3s;
}

.exam-group-group-card {
  width: calc(50% - 20px);
}

.exam-group-user-card {
  cursor: move;
}

.exam-group-new-zone {
  width: calc(50% - 20px);
  border: 2px dashed var(--bd-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  transition: background-color 0.3s;
  max-height: 250px;
}

.exam-group-dragging {
  background-color: var(--bg-color-shallow);
}

.exam-group-divider {
  width: 0;
  border-right: 2px solid var(--bd-color);
}

.exam-group-skeleton {
  flex-grow: 1;
}
</style>
