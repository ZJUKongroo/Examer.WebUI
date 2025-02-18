<template>
  <div class="colbox container" id="login-container">
    <div id="login-sidebar">
      <!-- <div id="login-sidebar-announcement">
                示例公告
            </div> -->
      <div id="login-sidebar-title">
        <!-- ZJUKongroo<small>.StartUp</small> -->
        Examer
      </div>
    </div>
    <div class="rowbox" id="login-main" :class="{ registering: isRegistering }">
      <div style="flex-grow: 3"></div>
      <div id="login-title">
        {{ isRegistering ? "注册" : "登录" }}
      </div>
      <v-form ref="formRef" v-model="valid" lazy-validation>
        <v-text-field
          v-model="form.username"
          label="用户名"
          outlined
          dense
          required
        ></v-text-field>
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
  username: "",
  password: "",
});
const logining = ref(false);
const isRegistering = ref(false);

const toggleRegister = () => {
  isRegistering.value = !isRegistering.value;
};

function check(payload: LoginDto): boolean {
  if (payload.password.length <= 1 || payload.studentNo.length <= 1) {
    return false;
  }
  return true;
}

const store = useMainStore();
const router = useRouter();

function login(): void {
  let payload: LoginDto = {
    studentNo: form.value.username,
    password: form.value.password,
  };
  if (check(payload)) {
    logining.value = true;
    let request = axios.post("/Authentication?studentNo=3240100001", payload);
    if (request)
      request
        .then((res: { status: number; data: any }) => {
          if (res.status == 200) {
            ElMessage({
              type: "success",
              message: "登录成功",
            });
            const data = res.data;
            store.login(data)
            store.refreshExamData();
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
  } else
    ElMessage({
      type: "error",
      message: "用户名或密码格式错误",
    });
}

// function login() {
//   logining.value = true;
//   setTimeout(() => {
//     logining.value = false;
//     store.login("1","User");
//     const login_main = document.getElementById("login-main");
//     const login_sidebar = document.getElementById("login-sidebar");
//     if (login_main) leave("left", login_main);
//     if (login_sidebar)
//       leave("right", login_sidebar, 200, () => {
//         const container = document.getElementById("login-container");
//         if (container) fadeOut(container, 300, () => {
//           router.push("/");
//         });
//       });
//   }, 1000);
// }

const register = () => {
  // 注册逻辑
};

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

#login-sidebar {
  background-image: url("@/assets/img/login_sidebar_pic.jpg");
  flex-grow: 1;
  background-size: cover;
  position: relative;
}

#login-sidebar-title {
  position: absolute;
  bottom: 20px;
  left: 90px;
  font-size: 56px;
  color: white;
  text-shadow: 8px 5px 0px rgba(239, 239, 239, 0.2);
}

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

#login-main.registering {
  width: 50%;
}

#login-title {
  font-size: 50px;
  flex-grow: 1;
}

#login-input {
  text-align: left;
  justify-content: space-between;
}

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

#login-sidebar-announcement {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 15px;
  transform: translate(-50%, -50%);
  width: calc(60% - 40px);
  height: calc(60% - 40px);
  font-size: 35px;
  background-color: var(--bg-color);
  backdrop-filter: blur(30px);
  border: solid 1px var(--bd-color);
  padding: 20px;
  animation: login-sidebar-announcement-entry 0.5s;
}

#toggle-register-wrapper {
  flex-grow: 1;
  text-align: center;
}

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
