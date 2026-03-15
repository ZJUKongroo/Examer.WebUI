<template>
  <div id="user-detail-page">
    <div id="user-detail-header">
      <v-icon size="48" color="primary">mdi-account-circle</v-icon>
      <div>
        <div id="user-detail-name">{{ detail?.user?.name ?? "加载中..." }}</div>
        <div id="user-detail-studentno">学号：{{ detail?.user?.studentNumber ?? "—" }}</div>
      </div>
    </div>

    <v-divider class="my-4" />

    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="detail" id="user-detail-grid">
      <div class="detail-item" v-for="field in detailFields" :key="field.label">
        <span class="detail-label">{{ field.label }}</span>
        <span class="detail-value">{{ field.value || "—" }}</span>
      </div>
    </div>

    <v-alert v-else type="error" variant="tonal" text="无法加载用户信息" class="mt-4" />

    <div v-if="detail" class="mt-4 d-flex justify-end">
      <v-btn color="primary" variant="tonal" @click="openEditDialog">{{ isViewingSelf ? "编辑我的信息" : "编辑该用户信息" }}</v-btn>
    </div>

    <v-dialog v-model="editDialog" max-width="760">
      <v-card>
        <v-card-title>编辑用户信息</v-card-title>
        <v-card-text>
          <v-form id="user-edit-form" lazy-validation>
            <v-select v-model="editForm.gender" :items="genderOptions" label="性别" density="comfortable" item-title="title" item-value="value" />
            <v-select v-model="editForm.ethnicGroup" :items="ethnicGroupOptions" label="民族" density="comfortable" item-title="title" item-value="value" />
            <v-text-field v-model="editForm.dateOfBirth" type="date" label="出生日期" density="comfortable" />
            <v-text-field v-model="editForm.college" label="学院（园）" density="comfortable" />
            <v-text-field v-model="editForm.homeAddress" label="大类" density="comfortable" />
            <v-text-field v-model="editForm.major" label="专业" density="comfortable" />
            <v-text-field v-model="editForm.class" label="班级" density="comfortable" />
              <v-text-field v-model="editForm.phoneNumber" label="手机号" density="comfortable" />
            <v-text-field v-model="editForm.seniorHigh" label="高中" density="comfortable" />
            <v-text-field v-model="editForm.dormitory" label="宿舍" density="comfortable" />
            <!-- <v-select v-model="editForm.politicalStatus" :items="politicalStatusOptions" label="政治面貌" density="comfortable" item-title="title" item-value="value" /> -->

            <v-text-field v-model="editForm.englishLevel" label="英语等级（填写考试名称和分数）" density="comfortable" />
            <v-text-field v-model.number="editForm.gpaOfAllCourses" type="number" step="0.01" min="0" label="总课程均绩" density="comfortable" />
            <!-- <v-text-field v-model.number="editForm.gpaOfMajorCourses" type="number" step="0.01" min="0" label="专业课程绩点" density="comfortable" /> -->
            <v-text-field v-model.number="editForm.rank" type="number" label="专业（大类）综合排名" density="comfortable" />
            <v-text-field v-model.number="editForm.collegeNumber" type="number" label="本专业（大类）人数" density="comfortable" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="editDialog = false">取消</v-btn>
          <v-btn color="primary" :loading="savingEdit" @click="saveEdit">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { AddUserDetailDto, UserDetailDto } from "~/types";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserDetail, updateUserDetail } from "~/api";
import { buildUserDetailPayload, cloneUserDetailToEditForm } from "~/mappers";
import { useMainStore } from "~/store/mainStore";
import { UserRole, EthnicGroup } from "~/enums";
import { ElMessage } from "element-plus";
import { animate, spring, stagger } from "animejs";

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const detail = ref<UserDetailDto | null>(null);
const loading = ref(true);
const editDialog = ref(false);
const savingEdit = ref(false);

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

// const politicalStatusOptions = Object.keys(PoliticalStatus)
//   .filter((key) => Number.isNaN(Number(key)) && key !== "Null")
//   .map((key) => ({
//     title: key,
//     value: PoliticalStatus[key as keyof typeof PoliticalStatus] as number,
//   }));

const editForm = ref<AddUserDetailDto>({
  gender: 1,
  ethnicGroup: 1,
  dateOfBirth: "",
  phoneNumber: "",
  college: "",
  major: "",
  class: "",
  seniorHigh: "",
  dormitory: "",
  politicalStatus: 1,
  homeAddress: "",
  englishLevel: "",
  gpaOfAllCourses: 0,
  gpaOfMajorCourses: 0,
  rank: 1,
  collegeNumber: 1,
});

const viewingUserId = computed(() => (typeof route.query.id === "string" ? route.query.id : ""));
const isAdmin = computed(() => store.userRole != UserRole.User);
const isViewingSelf = computed(() => !viewingUserId.value);

function ethnicGroupName(code?: number): string {
  if (!code) return "—";
  return EthnicGroup[code] ?? "—";
}

// function politicalStatusName(code?: number): string {
//   if (!code) return "—";
//   return PoliticalStatus[code] ?? "—";
// }

function genderName(code?: number): string {
  if (!code) return "—";
  return code === 1 ? "男" : code === 2 ? "女" : "—";
}

const detailFields = computed(() => [
  { label: "姓名", value: detail.value?.user?.name },
  { label: "学号", value: detail.value?.user?.studentNumber },
  { label: "性别", value: genderName(detail.value?.gender) },
  { label: "民族", value: ethnicGroupName(detail.value?.ethnicGroup) },
  { label: "出生日期", value: detail.value?.dateOfBirth },
  { label: "学院（园）", value: detail.value?.college },
  { label: "大类", value: detail.value?.homeAddress },
  { label: "专业", value: detail.value?.major },
  { label: "班级", value: detail.value?.class },
  { label: "手机号", value: detail.value?.phoneNumber },
  { label: "高中", value: detail.value?.seniorHigh },
  { label: "宿舍", value: detail.value?.dormitory },
  // { label: "政治面貌", value: politicalStatusName(detail.value?.politicalStatus) },
  { label: "英语等级（填写考试名称和分数）", value: detail.value?.englishLevel },
  { label: "总课程均绩", value: detail.value?.gpaOfAllCourses },
  // { label: "专业课程绩点", value: detail.value?.gpaOfMajorCourses },
  { label: "专业（大类）综合排名", value: detail.value?.rank },
  { label: "本专业（大类）人数", value: detail.value?.collegeNumber },
]);

async function fetchDetail(): Promise<void> {
  if (viewingUserId.value && !isAdmin.value) {
    await router.replace({ path: "/user/detail" });
    return;
  }

  loading.value = true;
  try {
    detail.value = await getUserDetail(viewingUserId.value || undefined);
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "获取用户信息失败" });
    detail.value = null;
  } finally {
    loading.value = false;
  }
}

function openEditDialog(): void {
  if (!detail.value) return;
  editForm.value = cloneUserDetailToEditForm(detail.value);
  editDialog.value = true;
}

async function saveEdit(): Promise<void> {
  savingEdit.value = true;
  try {
    const payload = buildUserDetailPayload(editForm.value);

    await updateUserDetail(payload, isViewingSelf.value ? undefined : viewingUserId.value);
    ElMessage({ type: "success", message: "用户信息更新成功" });
    editDialog.value = false;
    await fetchDetail();
  } catch (error) {
    console.error(error);
    ElMessage({ type: "error", message: "更新失败，请重试" });
  } finally {
    savingEdit.value = false;
  }
}

watch(
  () => route.query.id,
  async () => {
    await fetchDetail();
  }
);

onMounted(async () => {
  animate('#user-detail-page',{
    translateX: [30, 0],
    opacity: [0, 1],
    delay: stagger(80),
    ease: spring(),
  })
  await fetchDetail();
  animate('#user-detail-grid .detail-item',{
    translateY: [20, 0],
    opacity: [0, 1],
    delay: stagger(50,{
      grid: [3,5]
    }),
    ease: spring(),
  })
});
</script>

<style lang="scss">
#user-detail-page {
  max-width: 1200px;
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
</style>
