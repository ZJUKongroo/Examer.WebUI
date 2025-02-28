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
      <!-- 根据是否注册显示标题 -->
      <div id="login-title">
        {{ isRegistering ? "注册" : "登录" }}
      </div>
      <v-form ref="formRef" lazy-validation>
        <!-- 用户名输入 -->
        <v-text-field
          v-model="form.username"
          label="用户名"
          outlined
          dense
          required
        ></v-text-field>
        <!-- 密码输入，回车触发登录 -->
        <v-text-field
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
        <!-- 登录按钮，根据 logining 状态显示加载动画或箭头图标 -->
        <button
          type="button"
          id="login-button"
          @click="login"
          :class="{ 'login-button-active': logining }"
        >
          <v-icon v-if="logining" class="is-loading" icon="mdi-loading" spin />
          <v-icon v-else icon="mdi-arrow-right" />
        </button>
      </div>
      <div id="toggle-register-wrapper">
        <!-- 切换注册/登录按钮，目前仅支持登录 -->
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

// 登录表单数据
const form = ref({
  username: "",
  password: "",
});
const logining = ref(false); // 正在登录标志
const isRegistering = ref(false); // 注册状态标志

// 切换注册状态，目前不启用注册功能
const toggleRegister = () => {
  // isRegistering.value = !isRegistering.value;
  ElMessage.error("暂不支持注册");
};

// 登录表单校验
function check(payload: LoginDto): boolean {
  if (payload.password.length <= 1 || payload.studentNo.length <= 1) {
    return false;
  }
  return true;
}

const store = useMainStore();
const router = useRouter();

// 登录函数，提交表单数据到后端进行验证
function login(): void {
  let payload: LoginDto = {
    studentNo: form.value.username,
    password: form.value.password,
  };
  
  if (check(payload)) {
    logining.value = true;
    // 发起登录请求，通过查询字符串传输学号信息
    let request = axios.post(`/Authentication?studentNo=${form.value.username}`, payload);
    if (request)
      request
        .then((res: { status: number; data: any }) => {
          if (res.status == 200) {
            ElMessage({
              type: "success",
              message: "登录成功",
            });
            // 登录成功，保存用户数据并刷新考试数据
            const data = res.data;
            store.login(data);
            store.refreshExamData();
            // 执行离场动画，登录成功后跳转页面
            const login_main = document.getElementById("login-main");
            const login_sidebar = document.getElementById("login-sidebar");
            if (login_main) leave("left", login_main);
            if (login_sidebar)
              leave("right", login_sidebar, 200, () => {
                const container = document.getElementById("login-container");
                if (container)
                  fadeOut(container, 300, () => router.push("/"));
              });
          }
        })
        .catch((e: any) => {
          console.log(e);
          logining.value = false;
          ElMessage({
            type: "error",
            message: `登录失败`,
          });
        });
  } else {
    ElMessage({
      type: "error",
      message: "用户名或密码格式错误",
    });
  }
}

// 页面挂载后执行动画效果
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
