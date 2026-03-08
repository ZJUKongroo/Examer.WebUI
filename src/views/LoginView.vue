<template>
  <div class="colbox container" id="login-container">
    <div id="login-sidebar">
      <!-- 登录页面侧边栏背景 -->
      <div id="login-sidebar-title">
        <strong>ACEE</strong> 试题提交系统
      </div>
    </div>
    <div class="rowbox" id="login-main" :class="{ registering: isRegistering }">
      <div style="flex-grow: 3"></div>
      <div id="login-title">
        {{ isRegistering ? "注册" : "登录" }}
      </div>
      <v-form lazy-validation>
        <v-text-field
          v-model="form.studentNo"
          label="学号"
          outlined
          dense
          required
          @keyup.enter="isRegistering ? startRegister() : login()"
        ></v-text-field>
        <v-text-field
          v-if="!isRegistering"
          v-model="form.password"
          label="密码"
          type="password"
          outlined
          dense
          required
          @keyup.enter="login"
        ></v-text-field>
      </v-form>
      <div id="login-button-wrapper">
        <button
          type="button"
          id="login-button"
          @click="isRegistering ? startRegister() : login()"
          :class="{ 'login-button-active': loading }"
        >
          <v-icon v-if="loading" class="is-loading" icon="mdi-loading" spin />
          <v-icon v-else :icon="isRegistering ? 'mdi-email-fast-outline' : 'mdi-arrow-right'" />
        </button>
      </div>
      <div id="toggle-register-wrapper">
        <v-btn variant="plain" id="toggle-register-button" @click="toggleRegister">
          {{ isRegistering ? "已有账号？登录" : "没有账号？注册" }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LoginDto } from "~/types";
import { ref, onMounted } from "vue";
import { entry, leave, fadeOut, fadeIn } from "~/ts/entry";
import { useRouter } from "vue-router";
import { useMainStore } from "~/store/mainStore";
import axios from '~/ts/request';
import { ElMessage } from "element-plus";

const form = ref({
  studentNo: "",
  password: "",
});
const loading = ref(false);
const isRegistering = ref(false);

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
  form.value.password = "";
};

function checkLoginPayload(payload: LoginDto): boolean {
  if (payload.password.length <= 1 || payload.studentNo.length <= 1) {
    return false;
  }
  return true;
}

function checkStudentNo(studentNo: string): boolean {
  return studentNo.trim().length > 1;
}

function extractRegisterToken(data: any): string {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data.token === "string") return data.token;
  if (typeof data.registerToken === "string") return data.registerToken;
  if (typeof data.data?.token === "string") return data.data.token;
  return "";
}

async function requestRegisterToken(studentNo: string): Promise<string> {
  const encodedStudentNo = encodeURIComponent(studentNo);
  const candidates = [
    `/Authentication/Register?studentNo=${encodedStudentNo}`,
    `/Authentication/Register/Email?studentNo=${encodedStudentNo}`,
    `/Authentication/Registration?studentNo=${encodedStudentNo}`,
  ];

  let lastError: unknown = null;
  for (const endpoint of candidates) {
    try {
      const res = await axios.post(endpoint);
      return extractRegisterToken(res.data);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

const store = useMainStore();
const router = useRouter();

async function startRegister(): Promise<void> {
  const studentNo = form.value.studentNo.trim();
  if (!checkStudentNo(studentNo)) {
    ElMessage({
      type: "error",
      message: "请先输入有效学号",
    });
    return;
  }

  loading.value = true;
  try {
    const token = await requestRegisterToken(studentNo);
    ElMessage({
      type: "success",
      message: "注册邮件已发送，请继续完善信息",
    });

    if (token) {
      router.push({ path: "/login/complete", query: { token } });
    } else {
      ElMessage({
        type: "warning",
        message: "未获取到 token，请通过邮件中的链接继续注册",
      });
    }
  } catch (error) {
    console.log(error);
    ElMessage({
      type: "error",
      message: "发送注册邮件失败",
    });
  } finally {
    loading.value = false;
  }
}

async function login(): Promise<void> {
  const payload: LoginDto = {
    studentNo: form.value.studentNo,
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
    const res = await axios.post(`/Authentication?studentNo=${encodeURIComponent(form.value.studentNo)}`, payload);
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
  bottom: 20px;
  left: 50px;
  font-size: 56px;
  color: white;
  text-shadow: 8px 5px 0px rgba(239, 239, 239, 0.2);
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
