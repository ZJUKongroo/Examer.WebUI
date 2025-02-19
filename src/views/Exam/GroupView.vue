<template>
  <div class="exam-group-container">
    <UniversalHeader title="分组管理" class="exam-group-header exam-group-view-anime">
      <template #append>
        <v-btn>提交</v-btn>
      </template>
    </UniversalHeader>
    <div class="exam-group-flex-container">
      <template v-if="loading">
        <div class="exam-group-skeleton">
          <v-skeleton-loader type="list-item-two-line" class="mb-4" v-for="n in 3" :key="n" />
        </div>
      </template>
      <template v-else>
        <div class="exam-group-users-container">
          <div class="exam-group-undistributed-card">
            <v-card title="等待分配的用户" @dragover.prevent="draggingOver = 'undistributed'"
              :class="{ 'exam-group-dragging': draggingOver === 'undistributed' }" @drop="onDropUndistributed">
              <v-card-text>
                <v-card v-for="user in users" :key="user.id" class="exam-group-user-card" draggable="true"
                  @dragstart="onDragStart(user)" variant="tonal">
                  <v-card-title>{{ user.name }}</v-card-title>
                </v-card>
              </v-card-text>
            </v-card>
          </div>
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
          <div class="exam-group-new-zone" @drop.prevent="handleNewGroup" @dragover.prevent="draggingOver = 'new'"
            @dragleave.prevent="draggingOver = ''" :class="{ 'exam-group-dragging': draggingOver === 'new' }">
            <p>放下以新建组</p>
          </div>
          <v-card v-for="group in paginatedExamGroup" :key="group.id" class="exam-group-group-card"
            :class="{ 'exam-group-dragging': draggingOver === group.id }" @dragover.prevent="draggingOver = group.id"
            @dragleave.prevent="draggingOver = ''" @drop="onDrop(group)">
            <template v-slot:title>
              <div class="exam-group-group-title">
                <template v-if="editingGroup !== group.id">
                  {{ group.name }}
                </template>
                <template v-else>
                  <v-text-field v-model="newName" placeholder="新组名" persistent-hint density="compact" hint="输入新组名，回车确认"
                    @keydown.enter="confirmChangeGroupName(group.id)">
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
      </template>
    </div>
    <div class="exam-group-view-anime">
      <v-pagination v-if="totalPages >= 1" v-model="currentPage" :length="totalPages" circle class="mt-4" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { ElMessage } from "element-plus";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import UniversalHeader from "~/components/UniversalHeader.vue";
import type { ExamType } from "~/enums";
import axios from '~/ts/request';
import type { Group, User } from '~/types';

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

// Pagination controls
const currentPage = ref(1);
const pageSize = 4;
const paginatedExamGroup = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return examGroup.value.slice(start, start + pageSize);
});
const totalPages = computed(() => Math.ceil(examGroup.value.length / pageSize));

const onDragStart = (user: User, from?: Group) => {
  draggingInfo.value = {
    user,
    from,
  };
};

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
  if (user) {
    try {
      if (from) {
        await axios.delete(`/group/distribution/${from.id}`, {
          data: [user.id]
        }); // Remove from Group
        from.users = from.users.filter((u) => u.id !== user.id)
      }
      else users.value = users.value.filter((u) => u.id !== user.id);
      const { data } = await axios.post<Group>(`/group`, {
        name: "新组",
        description: ""
      });// New Group
      await axios.post(`/group/distribution/${data.id}`, [user.id]); // Assign to Group
      await axios.post(`/exam/assignment/${examId.value}`, [data.id]); // Assign to Exam
      data.users.push(user);
      examGroup.value.push(data);

      ElMessage.success("新建组成功");
    } catch (error) {
      ElMessage.error("新建组失败");
    }
  }
  draggingInfo.value = null;
  draggingOver.value = "";
};

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
  const res = await axios.get<User[]>(`/user`);
  users.value = res.data;
}

async function getAllGroup() {
  const res = await axios.get<Group[]>(`/group`);
  groups.value = res.data;
}

async function getExamGroup() {
  interface ExamGroupResponse {
    id: string,
    name: string,
    examType: ExamType,
    startTime: string,
    endTime: string,
    users: string[]
  }
  const res = await axios.get<ExamGroupResponse>(`/exam/groups/${examId.value}`);
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
  console.log(groups.value, users.value)
  await getExamGroup();
  loading.value = false;
  nextTick(()=>{
    anime({
    targets: '.exam-group-group-card',
    translateY: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  })
  anime({
    targets: '.exam-group-undistributed-card',
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
}

.exam-group-dragging {
  background-color: var(--bg-color-shallow);
}

.exam-group-divider{
  width: 0;
  border-right: 2px solid var(--bd-color);
}

.exam-group-skeleton{
  flex-grow: 1;
}
</style>
