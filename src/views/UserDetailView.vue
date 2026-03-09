<template>
  <div id="user-detail-page">
    <!-- 当前用户信息卡片 -->
    <div id="user-detail-header">
      <v-icon size="48" color="primary">mdi-account-circle</v-icon>
      <div>
        <div id="user-detail-name">{{ me?.name ?? '加载中...' }}</div>
        <div id="user-detail-studentno">学号：{{ me?.studentNo }}</div>
      </div>
    </div>

    <v-divider class="my-4" />

    <div v-if="loadingMe" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="me" id="user-detail-grid">
      <div class="detail-item" v-for="field in detailFields" :key="field.label">
        <span class="detail-label">{{ field.label }}</span>
        <span class="detail-value">{{ field.value || '—' }}</span>
      </div>
    </div>

    <div class="mt-4 d-flex justify-end">
      <v-btn color="primary" variant="tonal" @click="openEditDialog(me, true)">编辑我的信息</v-btn>
    </div>

    <!-- <v-alert v-else type="error" variant="tonal" text="无法加载个人信息" class="mt-4" /> -->

    <v-dialog v-model="editDialog" max-width="760">
      <v-card>
        <v-card-title>编辑用户信息</v-card-title>
        <v-card-text>
          <v-form id="user-edit-form" lazy-validation>
            <v-select v-model="editForm.gender" :items="genderOptions" label="性别" density="comfortable"
              item-title="title" item-value="value" />
            <v-select v-model="editForm.ethnicGroup" :items="ethnicGroupOptions" label="民族" density="comfortable"
              item-title="title" item-value="value" />
            <v-text-field v-model="editForm.dateOfBirth" type="date" label="出生日期" density="comfortable" />
            <v-text-field v-model="editForm.phoneNumber" label="手机号" density="comfortable" />
            <v-text-field v-model="editForm.college" label="学院" density="comfortable" />
            <v-text-field v-model="editForm.major" label="专业" density="comfortable" />
            <v-text-field v-model="editForm.class" label="班级" density="comfortable" />
            <v-text-field v-model="editForm.campus" label="校区" density="comfortable" />
            <v-text-field v-model="editForm.dormitory" label="宿舍" density="comfortable" />
            <v-select v-model="editForm.politicalStatus" :items="politicalStatusOptions" label="政治面貌"
              density="comfortable" item-title="title" item-value="value" />
            <v-text-field v-model="editForm.homeAddress" label="家庭住址" density="comfortable" />
            <v-text-field v-model="editForm.englishLevel" label="英语等级" density="comfortable" />
            <v-text-field v-model.number="editForm.gpaOfAllCourses" type="number" label="总课程绩点" density="comfortable" />
            <v-text-field v-model.number="editForm.gpaOfMajorCourses" type="number" label="专业课程绩点"
              density="comfortable" />
            <v-text-field v-model.number="editForm.rank" type="number" label="排名" density="comfortable" />
            <v-text-field v-model.number="editForm.collegeNumber" type="number" label="学院人数" density="comfortable" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="editDialog = false">取消</v-btn>
          <v-btn color="primary" :loading="savingEdit" @click="saveEdit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 管理员：全部用户列表 -->
    <template v-if="isAdmin">
      <v-divider class="my-6" />
      <div id="user-list-title">所有用户</div>

      <div v-if="loadingList" class="text-center py-6">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <v-table v-else id="user-detail-table" density="compact">
        <thead>
          <tr>
            <th>姓名</th>
            <th>学号</th>
            <th>学院</th>
            <th>专业</th>
            <th>班级</th>
            <th>手机号</th>
            <th>民族</th>
            <th>政治面貌</th>
            <th>校区</th>
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
            <td>{{ ethnicGroupName(u.ethnicGroup) }}</td>
            <td>{{ politicalStatusName(u.politicalStatus) }}</td>
            <td>{{ u.campus || '—' }}</td>
            <td>
              <v-btn size="small" variant="text" @click="openEditDialog(u)">编辑</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div class="d-flex justify-center mt-4" v-if="!loadingList">
        <v-pagination v-model="page" :length="totalPages" :total-visible="7" @update:model-value="fetchUserList" />
      </div>

    </template>
  </div>
</template>

<script lang="ts" setup>
import type { UserDetailDto } from "~/types";
import { ref, computed, onMounted } from "vue";
import axios from "~/ts/request";
import { useMainStore } from "~/store/mainStore";
import { UserRole, EthnicGroup, PoliticalStatus } from "~/enums";
import { ElMessage } from "element-plus";

type UserDetailRecord = UserDetailDto & {
  gender?: number;
  ethnicGroup?: number;
  dateOfBirth?: string;
  phoneNumber?: string;
  politicalStatus?: number;
  homeAddress?: string;
  englishLevel?: string;
  gpaOfAllCourses?: number;
  gpaOfMajorCourses?: number;
  rank?: number;
  collegeNumber?: number;
};

const store = useMainStore();

const me = ref<UserDetailRecord | null>(null);
const loadingMe = ref(true);

const userList = ref<UserDetailRecord[]>([]);
const loadingList = ref(false);
const page = ref(1);
const pageSize = 20;
const totalPages = ref(1);
const editDialog = ref(false);
const savingEdit = ref(false);
const editingUserId = ref("");
const editingSelf = ref(false);

const genderOptions = [
  { title: "男", value: 1 },
  { title: "女", value: 2 },
];

const ethnicGroupOptions = Object.keys(EthnicGroup)
  .filter((key) => Number.isNaN(Number(key)) && key !== "Null")
  .map((key) => ({
    title: key,
    value: EthnicGroup[key as keyof typeof EthnicGroup] as number,
  }));

const politicalStatusOptions = Object.keys(PoliticalStatus)
  .filter((key) => Number.isNaN(Number(key)) && key !== "Null")
  .map((key) => ({
    title: key,
    value: PoliticalStatus[key as keyof typeof PoliticalStatus] as number,
  }));

const editForm = ref({
  gender: 1,
  ethnicGroup: 1,
  dateOfBirth: "",
  phoneNumber: "",
  college: "",
  major: "",
  class: "",
  campus: "",
  dormitory: "",
  politicalStatus: 1,
  homeAddress: "",
  englishLevel: "",
  gpaOfAllCourses: 0,
  gpaOfMajorCourses: 0,
  rank: 1,
  collegeNumber: 1,
});

const isAdmin = computed(() => store.userRole === UserRole.Administrator);

function getPhone(user?: Partial<UserDetailRecord> | null): string {
  if (!user) return "—";
  return user.phoneNumber ?? user.phoneNo ?? "—";
}

function ethnicGroupName(code?: number): string {
  if (!code) return "—";
  return EthnicGroup[code] ?? "—";
}

function politicalStatusName(code?: number): string {
  if (!code) return "—";
  return PoliticalStatus[code] ?? "—";
}

const detailFields = computed(() => [
  { label: "姓名", value: me.value?.name },
  { label: "学号", value: me.value?.studentNo },
  { label: "性别", value: me.value?.gender === 1 ? "男" : me.value?.gender === 2 ? "女" : "—" },
  { label: "民族", value: ethnicGroupName(me.value?.ethnicGroup) },
  { label: "出生日期", value: me.value?.dateOfBirth },
  { label: "学院", value: me.value?.college },
  { label: "专业", value: me.value?.major },
  { label: "班级", value: me.value?.class },
  { label: "手机号", value: getPhone(me.value) },
  { label: "校区", value: me.value?.campus },
  { label: "宿舍", value: me.value?.dormitory },
  { label: "政治面貌", value: politicalStatusName(me.value?.politicalStatus) },
  { label: "家庭住址", value: me.value?.homeAddress },
  { label: "英语等级", value: me.value?.englishLevel },
  { label: "总课程绩点", value: me.value?.gpaOfAllCourses },
  { label: "专业课程绩点", value: me.value?.gpaOfMajorCourses },
  { label: "排名", value: me.value?.rank },
  { label: "学院人数", value: me.value?.collegeNumber },
]);

async function fetchMe(): Promise<void> {
  loadingMe.value = true;
  try {
    const res = await axios.get("/user/detail/me");
    me.value = res.data;
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "获取个人信息失败" });
  } finally {
    loadingMe.value = false;
  }
}

async function fetchUserList(): Promise<void> {
  loadingList.value = true;
  try {
    const res = await axios.get("/user/detail", {
      params: { PageNumber: page.value, PageSize: pageSize },
    });
    const data: UserDetailRecord[] = res.data;
    userList.value = data;
    // 若响应头包含总数则可精确计算，否则通过返回条数判断是否还有下一页
    const total = Number(res.headers["x-total-count"] ?? res.headers["x-pagination-totalcount"] ?? 0);
    totalPages.value = total > 0 ? Math.ceil(total / pageSize) : data.length === pageSize ? page.value + 1 : page.value;
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "获取用户列表失败" });
  } finally {
    loadingList.value = false;
  }
}

function openEditDialog(user: UserDetailRecord | null, self = false): void {
  if (!user) return;
  editingSelf.value = self;
  editingUserId.value = user.id;
  editForm.value = {
    gender: user.gender ?? 1,
    ethnicGroup: user.ethnicGroup ?? 1,
    dateOfBirth: user.dateOfBirth ?? "",
    phoneNumber: user.phoneNumber ?? user.phoneNo ?? "",
    college: user.college ?? "",
    major: user.major ?? "",
    class: user.class ?? "",
    campus: user.campus ?? "",
    dormitory: user.dormitory ?? "",
    politicalStatus: user.politicalStatus ?? 1,
    homeAddress: user.homeAddress ?? "",
    englishLevel: user.englishLevel ?? "",
    gpaOfAllCourses: user.gpaOfAllCourses ?? 0,
    gpaOfMajorCourses: user.gpaOfMajorCourses ?? 0,
    rank: user.rank ?? 1,
    collegeNumber: user.collegeNumber ?? 1,
  };
  editDialog.value = true;
}

async function saveEdit(): Promise<void> {
  if (!editingUserId.value) return;
  savingEdit.value = true;
  try {
    const payload = {
      gender: Number(editForm.value.gender),
      ethnicGroup: Number(editForm.value.ethnicGroup),
      dateOfBirth: editForm.value.dateOfBirth,
      phoneNumber: editForm.value.phoneNumber.trim(),
      college: editForm.value.college.trim(),
      major: editForm.value.major.trim(),
      class: editForm.value.class.trim(),
      campus: editForm.value.campus.trim(),
      dormitory: editForm.value.dormitory.trim(),
      politicalStatus: Number(editForm.value.politicalStatus),
      homeAddress: editForm.value.homeAddress.trim(),
      englishLevel: editForm.value.englishLevel.trim(),
      gpaOfAllCourses: Number(editForm.value.gpaOfAllCourses),
      gpaOfMajorCourses: Number(editForm.value.gpaOfMajorCourses),
      rank: Number(editForm.value.rank),
      collegeNumber: Number(editForm.value.collegeNumber),
    };
    const updatePath = editingSelf.value
      ? "/user/detail/me"
      : `/user/detail/${editingUserId.value}`;
    await axios.put(updatePath, payload);
    ElMessage({ type: "success", message: "用户信息更新成功" });
    editDialog.value = false;
    await fetchMe();
    if (isAdmin.value) {
      await fetchUserList();
    }
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "更新失败，请重试" });
  } finally {
    savingEdit.value = false;
  }
}

onMounted(async () => {
  await fetchMe();
  if (isAdmin.value) {
    await fetchUserList();
  }
});
</script>

<style lang="scss">
#user-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 20px;
}

#user-detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

#user-detail-name {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-color);
}

#user-detail-studentno {
  color: var(--text-color-tip);
  margin-top: 4px;
}

#user-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--bg-color-solid);
  border: 1px solid var(--bd-color);
}

.detail-label {
  font-size: 12px;
  color: var(--text-color-tip);
}

.detail-value {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
}

#user-list-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

#user-detail-table {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--bd-color);
}
</style>
