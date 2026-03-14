<template>
  <div id="register-complete-page">
    <div id="register-complete-card">
      <div id="register-complete-title">激活并完善个人信息</div>
      <v-form id="register-complete-form" lazy-validation>
        <v-select
          v-model="form.gender"
          :items="genderOptions"
          label="性别"
          density="comfortable"
          item-title="title"
          item-value="value"
          required
        />
        <v-select
          v-model="form.ethnicGroup"
          :items="ethnicGroupOptions"
          label="民族"
          density="comfortable"
          item-title="title"
          item-value="value"
          required
        />
        <v-text-field v-model="form.dateOfBirth" type="date" label="出生日期" density="comfortable" placeholder="请选择出生日期" required />
        <v-text-field v-model="form.college" label="学院（园）" density="comfortable" placeholder="例如：计算机科学与技术学院" required />
        <v-text-field v-model="form.homeAddress" label="大类" density="comfortable" placeholder="例如：云峰学园" required />
        <v-text-field v-model="form.major" label="专业" density="comfortable" placeholder="例如：软件工程" required />
        <v-text-field v-model="form.class" label="班级" density="comfortable" placeholder="例如：软工2301" required />
        <v-text-field v-model="form.phoneNumber" label="手机号" density="comfortable" placeholder="例如：13800138000" required />
        <v-text-field v-model="form.seniorHigh" label="高中" density="comfortable" placeholder="例如：杭州市高级中学" required />
        <v-text-field v-model="form.dormitory" label="宿舍" density="comfortable" placeholder="例如：丹阳3舍301" required />
        <v-text-field v-model="form.englishLevel" label="英语等级（填写考试名称和分数）" density="comfortable" placeholder="请填写雅思/托福/英语四级/英语六级成绩" required />
        <v-text-field
          v-model.number="form.gpaOfAllCourses"
          type="number"
          step="0.01"
          min="0"
          label="总课程均绩"
          density="comfortable"
          placeholder="填写总课程均绩，例如 3.75"
          required
        />
        <v-text-field v-model.number="form.rank" type="number" label="专业（大类）综合排名" density="comfortable" required />
        <v-text-field v-model.number="form.collegeNumber" type="number" label="本专业（大类）人数" density="comfortable" required @keyup.enter="submitForm" />
      </v-form>

      <div id="register-complete-message" :class="noticeType" v-if="noticeMessage">{{ noticeMessage }}</div>

      <div id="register-complete-actions">
        <v-btn color="primary" size="large" :loading="submitting" @click="submitForm">
          提交
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "~/ts/request";
import { animate, spring } from "animejs";
import { useMainStore } from "~/store/mainStore";
import type { AddUserDetailDto, LoginCredientialDto } from "~/types";
import { EthnicGroup } from "~/enums";

const route = useRoute();
const router = useRouter();
const submitting = ref(false);
const noticeMessage = ref("");
const noticeType = ref<"success" | "error">("success");
const store = useMainStore();


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

function getTokenFromQuery(): string {
  const queryToken = route.query.token;
  return typeof queryToken === "string" ? queryToken.trim() : "";
}

const form = ref<AddUserDetailDto>({
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

onMounted(() => {
  animate("#register-complete-card", {
    translateY: [20, 0],
    opacity: [0, 1],
    ease: spring(),
  });
  animate("#register-complete-form", {
    translateX: [20, 0],
    opacity: [0, 1],
    delay: 50,
    ease: spring(),
  });
});

function validateForm(): boolean {
  noticeMessage.value = "";

  if (!getTokenFromQuery()) {
    noticeType.value = "error";
    noticeMessage.value = "链接缺少 token 参数，请从邮箱中的激活链接进入";
    return false;
  }

  if (
    !form.value.dateOfBirth ||
    form.value.phoneNumber.trim().length <= 5 ||
    form.value.college.trim().length <= 1 ||
    form.value.major.trim().length <= 1 ||
    form.value.class.trim().length <= 1 ||
    form.value.seniorHigh.trim().length <= 0 ||
    form.value.dormitory.trim().length <= 0 ||
    form.value.homeAddress.trim().length <= 1 ||
    form.value.englishLevel.trim().length <= 0
  ) {
    noticeType.value = "error";
    noticeMessage.value = "请完整填写表单中的必填信息";
    return false;
  }

  if (
    !Number.isFinite(form.value.gender) ||
    !Number.isFinite(form.value.ethnicGroup) ||
    !Number.isFinite(form.value.gpaOfAllCourses) ||
    !Number.isFinite(form.value.rank) ||
    !Number.isFinite(form.value.collegeNumber)
  ) {
    noticeType.value = "error";
    noticeMessage.value = "数字字段格式不正确";
    return false;
  }

  if (form.value.gpaOfAllCourses < 0) {
    noticeType.value = "error";
    noticeMessage.value = "绩点不能为负数";
    return false;
  }

  return true;
}

async function submitForm(): Promise<void> {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    const emailActivateToken = getTokenFromQuery();
    let credientials = await axios.post<LoginCredientialDto>(`/authentication/activate/${encodeURIComponent(emailActivateToken)}`);
    store.login(credientials.data);

    const payload: AddUserDetailDto = {
      gender: Number(form.value.gender),
      ethnicGroup: Number(form.value.ethnicGroup),
      dateOfBirth: form.value.dateOfBirth,
      phoneNumber: form.value.phoneNumber.trim(),
      college: form.value.college.trim(),
      major: form.value.major.trim(),
      class: form.value.class.trim(),
      seniorHigh: form.value.seniorHigh.trim(),
      dormitory: form.value.dormitory.trim(),
      // politicalStatus form input is temporarily disabled; use default value.
      politicalStatus: 1,
      homeAddress: form.value.homeAddress.trim(),
      englishLevel: form.value.englishLevel.trim(),
      gpaOfAllCourses: Number(form.value.gpaOfAllCourses),
      gpaOfMajorCourses:0,
      rank: Number(form.value.rank),
      collegeNumber: Number(form.value.collegeNumber),
    };

    await axios.post("/user/detail", payload);
    router.push("/user/detail");
  } catch (error) {
    console.error(error);
    noticeType.value = "error";
    noticeMessage.value = "提交失败，请检查 token 与表单信息后重试";
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss">
#register-complete-page {
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    radial-gradient(circle at 20% 10%, rgba(72, 149, 239, 0.16), transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(6, 214, 160, 0.12), transparent 40%),
    var(--bg-color-shallow);
}

#register-complete-card {
  width: min(560px, 100%);
  border-radius: 18px;
  padding: 28px;
  background: var(--bg-color-solid);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}

#register-complete-title {
  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text-color);
}

#register-complete-subtitle {
  margin-top: 8px;
  margin-bottom: 20px;
  color: var(--text-color-tip);
}

#register-complete-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

#register-complete-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

#register-complete-message {
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
}

#register-complete-message.success {
  color: #2e7d32;
}

#register-complete-message.error {
  color: #c62828;
}

@media (max-width: 640px) {
  #register-complete-page {
    padding: 16px;
    align-items: flex-start;
  }

  #register-complete-card {
    padding: 18px;
    border-radius: 14px;
  }

  #register-complete-title {
    font-size: 24px;
  }
}
</style>
