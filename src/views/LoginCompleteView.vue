<template>
  <div id="register-complete-page">
    <div id="register-complete-card">
      <div id="register-complete-title">完善注册信息</div>
      <div id="register-complete-subtitle">请补充基础资料以完成账号注册</div>

      <v-alert
        v-if="!token"
        type="warning"
        variant="tonal"
        density="comfortable"
        text="缺少 token，请通过邮件中的注册链接进入该页面。"
      />

      <v-form id="register-complete-form" lazy-validation>
        <v-text-field v-model="form.name" label="姓名" density="comfortable" required />
        <v-text-field v-model="form.college" label="学院" density="comfortable" required />
        <v-text-field v-model="form.major" label="专业" density="comfortable" required />
        <v-text-field v-model="form.className" label="班级" density="comfortable" required />
        <v-text-field v-model="form.phoneNo" label="手机号" density="comfortable" required />
        <v-text-field v-model="form.campus" label="校区（可选）" density="comfortable" />
        <v-text-field v-model="form.dormitory" label="宿舍（可选）" density="comfortable" />
        <v-text-field
          v-model="form.password"
          label="设置密码"
          type="password"
          density="comfortable"
          required
        />
        <v-text-field
          v-model="form.confirmPassword"
          label="确认密码"
          type="password"
          density="comfortable"
          required
          @keyup.enter="completeRegister"
        />
      </v-form>

      <div id="register-complete-actions">
        <v-btn color="primary" size="large" :loading="submitting" :disabled="!token" @click="completeRegister">
          确认完成注册
        </v-btn>
        <v-btn variant="text" @click="router.push('/login')">返回登录</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RegisterCompleteDto } from "~/types";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "~/ts/request";
import { ElMessage } from "element-plus";
import { animate, createSpring } from "animejs";

const route = useRoute();
const router = useRouter();
const submitting = ref(false);

const token = computed(() => {
  const queryToken = route.query.token;
  return typeof queryToken === "string" ? queryToken : "";
});

onMounted(()=>{
    animate("#register-complete-card", {
        translateY: [20, 0],
        opacity: [0, 1],
        ease: createSpring()
    })
    animate("#register-complete-form", {
        translateX: [20, 0],
        opacity: [0, 1],
        delay: 50,
        ease: createSpring()
    })
})

const form = ref({
  name: "",
  college: "",
  major: "",
  className: "",
  phoneNo: "",
  campus: "",
  dormitory: "",
  password: "",
  confirmPassword: "",
});

function validateForm(): boolean {
  if (!token.value) {
    ElMessage({ type: "error", message: "注册链接缺少 token" });
    return false;
  }
  if (
    form.value.name.trim().length <= 1 ||
    form.value.college.trim().length <= 1 ||
    form.value.major.trim().length <= 1 ||
    form.value.className.trim().length <= 1 ||
    form.value.phoneNo.trim().length <= 5
  ) {
    ElMessage({ type: "error", message: "请完整填写必填信息" });
    return false;
  }
  if (form.value.password.length <= 5) {
    ElMessage({ type: "error", message: "密码长度至少为 6 位" });
    return false;
  }
  if (form.value.password !== form.value.confirmPassword) {
    ElMessage({ type: "error", message: "两次输入密码不一致" });
    return false;
  }
  return true;
}

async function submitComplete(payload: RegisterCompleteDto): Promise<void> {
  const encodedToken = encodeURIComponent(token.value);
  const candidates = [
    `/Authentication/Register/Complete?token=${encodedToken}`,
    `/Authentication/Registration/Complete?token=${encodedToken}`,
    `/Authentication/RegisterComplete?token=${encodedToken}`,
  ];

  let lastError: unknown = null;
  for (const endpoint of candidates) {
    try {
      await axios.post(endpoint, payload);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function completeRegister(): Promise<void> {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    const payload: RegisterCompleteDto = {
      name: form.value.name.trim(),
      college: form.value.college.trim(),
      major: form.value.major.trim(),
      class: form.value.className.trim(),
      phoneNo: form.value.phoneNo.trim(),
      password: form.value.password,
      campus: form.value.campus.trim() || undefined,
      dormitory: form.value.dormitory.trim() || undefined,
    };

    await submitComplete(payload);
    ElMessage({ type: "success", message: "注册完成，请登录" });
    router.push("/login");
  } catch (error) {
    console.log(error);
    ElMessage({ type: "error", message: "注册失败，请检查信息后重试" });
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
