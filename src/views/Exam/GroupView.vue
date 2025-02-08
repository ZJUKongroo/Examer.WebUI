<template>
  <v-container>
    <UniversalHeader title="分组管理" class="exam-group-header">
      <template #append>
        <v-btn>提交</v-btn>
      </template>
    </UniversalHeader>
    <div class="exam-group-flex-container">
      <div class="exam-group-groups-container">
        <v-card
          v-for="(group, index) in groups"
          :key="group.id"
          class="exam-group-group-card"
          :class="{ 'exam-group-dragging': draggingOver === group.id }"
          @dragover.prevent="draggingOver = group.id"
          @dragleave.prevent="draggingOver = ''"
          @drop="onDrop(group)"
        >
          <template v-slot:title>
            <div class="exam-group-group-title">
              <template v-if="editingGroup !== group.id">
                {{ group.name }}
              </template>
              <template v-else>
                <v-text-field
                  v-model="newName"
                  placeholder="新组名"
                  persistent-hint
                  density="compact"
                  hint="输入新组名，回车确认"
                  @keydown.enter="confirmChangeGroupName(index)"
                >
                  <template #append-inner>
                    <v-btn
                      variant="text"
                      @click="editingGroup = ''"
                      icon="mdi-close"
                      size="small"
                    />
                  </template>
                </v-text-field>
              </template>
            </div>
          </template>
          <template v-slot:append>
            <v-btn
              @click="changeGroupName(index)"
              icon="mdi-text-box-edit-outline"
              variant="tonal"
              class="mr-2"
              size="small"
            ></v-btn>
            <v-btn
              @click="deleteGroup(index)"
              icon="mdi-delete"
              variant="tonal"
              size="small"
            ></v-btn>
          </template>
          <v-card-text>
            <v-card
              v-for="member in group.members"
              :key="member.id"
              class="exam-group-user-card"
              draggable="true"
              @dragstart="onDragStart(member, group)"
              variant="tonal"
            >
              <v-card-title>{{ member.name }}</v-card-title>
            </v-card>
          </v-card-text>
        </v-card>
        <div
          class="exam-group-new-zone"
          @drop.prevent="handleNewGroup"
          @dragover.prevent="draggingOver = 'new'"
          @dragleave.prevent="draggingOver = ''"
          :class="{ 'exam-group-dragging': draggingOver === 'new' }"
        >
          <p>放下以新建组</p>
        </div>
      </div>
      <div class="exam-group-users-container">
        <div class="exam-group-undistributed-card">
          <v-card
          title="等待分配的用户"
          
          @dragover.prevent="draggingOver = 'undistributed'"
          :class="{ 'exam-group-dragging': draggingOver === 'undistributed' }"
          @drop="onDropUndistributed"
        >
          <v-card-text>
            <v-card
              v-for="user in users"
              :key="user.id"
              class="exam-group-user-card"
              draggable="true"
              @dragstart="onDragStart(user)"
              variant="tonal"
            >
              <v-card-title>{{ user.name }}</v-card-title>
            </v-card>
          </v-card-text>
        </v-card>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import anime from "animejs";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import UniversalHeader from "~/components/UniversalHeader.vue";
import axios from '~/ts/request';

interface User {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  members: User[];
}

const users = ref<User[]>([
  { id: "1", name: "用户 1" },
  { id: "2", name: "用户 2" },
  { id: "3", name: "用户 3" },
]);

const groups = ref<Group[]>([
  { id: "1", name: "组 1", members: [] },
  { id: "2", name: "组 2", members: [] },
]);

const draggingInfo = ref<{
  user: User;
  from?: Group;
} | null>(null);
const draggingOver = ref("");
const editingGroup = ref<string>("");
const newName = ref<string>("");
const route = useRoute();

const onDragStart = (user: User, from?: Group) => {
  draggingInfo.value = {
    user,
    from,
  };
};

const onDrop = (group: Group) => {
  const user = draggingInfo.value?.user;
  const from = draggingInfo.value?.from;
  if (user && from?.id !== group.id) {
    group.members.push(user);
    if (from) from.members = from.members.filter((u) => u.id !== user.id);
    else users.value = users.value.filter((u) => u.id !== user.id);
  }
  draggingInfo.value = null;
  draggingOver.value = "";
};

const onDropUndistributed = () => {
  const user = draggingInfo.value?.user;
  const from = draggingInfo.value?.from;
  if (user && from) {
    users.value.push(user);
    from.members = from.members.filter((u) => u.id !== user.id);
  }
  draggingInfo.value = null;
  draggingOver.value = "";
};

const handleNewGroup = () => {
  const user = draggingInfo.value?.user;
  const from = draggingInfo.value?.from;
  if (user) {
    const group: Group = {
      id: String(groups.value.length + 1),
      name: "新组",
      members: [],
    };
    group.members.push(user);
    if (from) from.members = from.members.filter((u) => u.id !== user.id);
    else users.value = users.value.filter((u) => u.id !== user.id);
    groups.value.push(group);
  }
  draggingInfo.value = null;
  draggingOver.value = "";
};

const deleteGroup = (index: number) => {
  users.value = users.value.concat(groups.value[index].members);
  groups.value.splice(index, 1);
};

const changeGroupName = (index: number) => {
  editingGroup.value = groups.value[index].id;
  newName.value = groups.value[index].name;
};

const confirmChangeGroupName = (index: number) => {
  groups.value[index].name = newName.value;
  editingGroup.value = "";
};

function getExamUser(){
  const examId = route.query.id as string;
  debugger
  axios.get(`/exam/userorgroups/${examId}`).then(res=>{
    console.log(res.data)
  })
}

onMounted(()=>{
  getExamUser()
  anime({
    targets: '.exam-group-header',
    translateX: [20, 0],
    opacity: [0, 1],
  })
  anime({
    targets: '.exam-group-group-card',
    translateY: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
  })
  anime({
    targets: '.exam-group-undistributed-card',
    translateX: [20, 0],
    opacity: [0, 1],
    delay:200
  })
})
</script>

<style scoped>
.exam-group-flex-container {
  display: flex;
  gap: 20px;
}

.exam-group-users-container{
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

.exam-group-group-card{
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
</style>
