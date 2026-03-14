<template>
  <div class="colbox container" id="login-container">
    <div id="login-sidebar">
      <!-- 登录页面侧边栏背景 -->
      <div id="login-sidebar-title">
        <div class="subtitle">
          <span>2026</span><br>
          <span>Enrollment</span>
        </div>
        <div class="main-title">
          <strong>ACEE</strong> 试题提交系统
        </div>
      </div>
    </div>
    <div class="rowbox" id="login-main" :class="{ registering: isRegistering }">
      <div style="flex-grow: 3"></div>
      <template v-if="pageNotice">
        <v-alert type="info">
          {{ pageNotice }}
        </v-alert>
      </template>
      <div id="login-title">
        {{ isRegistering ? "注册" : isRecovering ? "找回" : "登录" }}
      </div>
      <v-form lazy-validation>
        <v-text-field v-model="form.studentNumber" label="学号" outlined dense required></v-text-field>
        <v-text-field v-if="isRegistering" v-model="form.name" label="姓名" type="name" outlined dense
          required></v-text-field>
        <v-text-field v-if="!isRecovering" v-model="form.password" label="密码" type="password" outlined dense required
          @keyup.enter="submit"></v-text-field>
        <v-text-field v-if="isRegistering" v-model="form.repeatPassword" label="重复密码" type="password" outlined dense
          required @keyup.enter="submit"></v-text-field>
      </v-form>
      <div id="login-button-wrapper">
        <button type="button" id="login-button" @click="submit" :class="{ 'login-button-active': loading }">
          <v-icon v-if="loading" class="is-loading" icon="mdi-loading" spin />
          <v-icon v-else :icon="isRegistering || isRecovering ? 'mdi-email-fast-outline' : 'mdi-arrow-right'" />
        </button>
      </div>
      <div id="toggle-register-wrapper">
        <v-btn variant="plain" id="toggle-register-button" @click="toggleRegister">
          {{ isRegistering ? "已有账号？登录" : "没有账号？注册" }}
        </v-btn>
        <v-btn variant="plain" id="toggle-recover-button" @click="toggleRecover">
          {{ isRecovering ? "返回登录" : "忘记密码" }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LoginCredientialDto, LoginDto } from "~/types";
import { ref, onMounted } from "vue";
import { entry, leave, fadeOut, fadeIn } from "~/ts/entry";
import { useRouter } from "vue-router";
import { useMainStore } from "~/store/mainStore";
import axios from '~/ts/request';
import { ElMessage } from "element-plus";

const form = ref({
  studentNumber: "",
  password: "",
  name: "",
  repeatPassword: "",
});
const loading = ref(false);
const isRegistering = ref(false);
const isRecovering = ref(false);
const pageNotice = ref("");

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
  if (isRegistering.value) {
    isRecovering.value = false;
  }
  form.value.password = "";
  form.value.name = "";
  form.value.repeatPassword = "";
};

const toggleRecover = () => {
  isRecovering.value = !isRecovering.value;
  if (isRecovering.value) {
    isRegistering.value = false;
  }
  form.value.password = "";
  form.value.name = "";
};

function checkLoginPayload(payload: LoginDto): boolean {
  if (payload.password.length <= 1 || payload.studentNumber.length <= 1) {
    return false;
  }
  return true;
}

const store = useMainStore();
const router = useRouter();

function submit(): void {
  pageNotice.value = "";
  if (isRecovering.value) {
    goToRecover();
  } else if (isRegistering.value) {
    goToRegister();
  } else {
    login();
  }
}

function checkRecoverPayload(): boolean {
  const studentNumberPattern = /^\d{10}$/;
  const { studentNumber } = form.value;

  if (!studentNumber || !studentNumberPattern.test(studentNumber)) {
    ElMessage({
      type: "error",
      message: "学号需为10位数字",
    });
    return false;
  }

  return true;
}

function checkRegisterPayload(): boolean {
  const namePattern = /^[\u4e00-\u9fa5]{2,4}$/;
  const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).{8,}$/;
  const studentNumberPattern = /^\d{10}$/;

  const { name, password, studentNumber, repeatPassword } = form.value;

  if (
    !name ||
    !namePattern.test(name) ||
    name.length < 2 ||
    name.length > 4
  ) {
    ElMessage({
      type: "error",
      message: "姓名需为2-4位中文字符",
    });
    return false;
  }

  if (
    !studentNumber ||
    !studentNumberPattern.test(studentNumber)
  ) {
    ElMessage({
      type: "error",
      message: "学号需为10位数字",
    });
    return false;
  }

  if (
    !password ||
    !passwordPattern.test(password)
  ) {
    ElMessage({
      type: "error",
      message: "密码需包含大写字母、小写字母、数字和特殊字符，且不少于8位",
    });
    return false;
  }

  if (password !== repeatPassword) {
    ElMessage({
      type: "error",
      message: "两次输入的密码不一致",
    });
    return false;
  }

  return true;
}

function goToRegister(): void {
  if (!checkRegisterPayload()) {
    return;
  }
  const studentNumber = form.value.studentNumber.trim();
  const payload = {
    studentNumber: studentNumber,
    name: form.value.name.trim(),
    password: form.value.password,
    email: `${studentNumber}@zju.edu.cn`
  }
  axios.post(`/authentication/register`, payload).then(res => {
    if (200 <= res.status && res.status <= 299) {
      pageNotice.value = "注册成功，请查看校内邮箱内的验证码";
      toggleRegister();
    }
  }).catch(error => {
    console.log(error);
    ElMessage({
      type: "error",
      message: "注册失败",
    });
  });
}

function goToRecover(): void {
  if (!checkRecoverPayload()) {
    return;
  }

  axios.post(`/authentication/reset/${form.value.studentNumber.trim()}`).then((res) => {
    if (200 <= res.status && res.status <= 299) {
      pageNotice.value = "找回密码邮件已发送，请查收邮箱并按提示重置密码";
      toggleRecover();
    }
  }).catch((error) => {
    console.log(error);
    ElMessage({
      type: "error",
      message: "发送找回密码邮件失败",
    });
  });
}

async function login(): Promise<void> {
  const payload: LoginDto = {
    studentNumber: form.value.studentNumber,
    password: form.value.password,
  };

  if (!checkLoginPayload(payload)) {
    ElMessage({
      type: "error",
      message: "用户名或密码格式错误",
    });
    return;
  }

  loading.value = true;
  try {
    const res = await axios.post<LoginCredientialDto>(`/authentication/login`, payload);
    if (res.status === 200) {
      ElMessage({
        type: "success",
        message: "登录成功",
      });
      const data = res.data;
      store.login(data);
      store.refreshExamData();

      const loginMain = document.getElementById("login-main");
      const loginSidebar = document.getElementById("login-sidebar");
      if (loginMain) leave("left", loginMain);
      if (loginSidebar) {
        leave("right", loginSidebar, 200, () => {
          const container = document.getElementById("login-container");
          if (container) {
            fadeOut(container, 300, () => router.push("/"));
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    ElMessage({
      type: "error",
      message: "登录失败",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const container = document.getElementById("login-container");
  const main = document.getElementById("login-main");
  const sidebar = document.getElementById("login-sidebar");
  if (main) entry("left", main);
  if (sidebar) entry("right", sidebar);
  if (container) fadeIn(container, 1000);
});
</script>

<style lang="scss">
@keyframes login-sidebar-announcement-entry {
  0% {
    transform: translate(calc(-50% - 20px), -50%);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

@keyframes loading-icon-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 侧边栏背景 */
#login-sidebar {
  background-image: url("@/assets/img/login_page.jpg");
  flex-grow: 1;
  background-size: cover;
  position: relative;
}

/* 侧边栏标题样式 */
#login-sidebar-title {
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white;
  text-align: left;
  line-height: 1.1;
}

.subtitle {
  font-size: 32px;
  font-weight: 300;
  opacity: 0.8;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.main-title {
  font-size: 56px;
  font-weight: bold;
  text-shadow: 8px 5px 0px rgba(239, 239, 239, 0.2);
}

@media (max-width: 1200px) {
  .subtitle { font-size: 24px; }
  .main-title { font-size: 40px; }
}

/* 登录主区域样式 */
#login-main {
  box-sizing: border-box;
  width: 30%;
  position: relative;
  text-align: center;
  height: 100%;
  padding-left: 6%;
  padding-right: 6%;
  border-left: solid 1px var(--bd-color);
  transition: 0.5s;
}

#login-title {
  font-size: 50px;
  flex-grow: 1;
}

/* 登录按钮样式及交互 */
#login-button-wrapper {
  flex-grow: 8;
  position: relative;
}

#login-button {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 70px;
  height: 70px;
  border-radius: 15px;
  transform: translate(-50%, -50%);
  outline: none;
  border: none;
  box-shadow: 0 5px 0 var(--login-button-bd);
  background-color: var(--login-button-bg);
  transition: 0.2s;
  cursor: pointer;
}

#login-button:hover {
  background-color: var(--login-button-hover);
}

#login-button:active {
  box-shadow: 0 1px 0 #999;
  transform: translate(-50%, calc(-50% + 4px));
}

.login-button-active {
  background-color: var(--login-button-hover);
}

#toggle-register-wrapper {
  flex-grow: 1;
  text-align: center;
}

#toggle-recover-button {
  margin-left: 4px;
}

#login-page-notice {
  min-height: 22px;
  margin-top: 8px;
  font-size: 14px;
  color: #2e7d32;
}

/* 切换注册按钮样式 */
#toggle-register-button {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  font-size: 16px;
}

.is-loading {
  animation: loading-icon-spin 1s infinite linear;
}
</style>
