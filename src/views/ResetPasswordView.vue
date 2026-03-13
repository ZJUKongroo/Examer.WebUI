<template>
  <div class="colbox container" id="reset-password-container">
    <div class="rowbox" id="reset-password-main">
      <div class="reset-password-animation" id="reset-password-title">重置密码</div>
      <v-alert class="reset-password-animation mb-4" id="reset-password-alert" v-if="pageNotice" type="info">
        {{ pageNotice }}
      </v-alert>
      <v-form class="reset-password-animation" v-else lazy-validation>
        <v-text-field
          v-model="form.password"
          label="新密码"
          type="password"
          outlined
          dense
          required
          @keyup.enter="submit"
        ></v-text-field>
        <v-text-field
          v-model="form.confirmPassword"
          label="确认新密码"
          type="password"
          outlined
          dense
          required
          @keyup.enter="submit"
        ></v-text-field>
      </v-form>
      <div class="reset-password-animation" id="reset-password-button-wrapper" v-if="!pageNotice">
        <button
          type="button"
          id="reset-password-button"
          @click="submit"
          :class="{ 'reset-password-button-active': loading }"
        >
          <v-icon v-if="loading" class="is-loading" icon="mdi-loading" spin />
          <v-icon v-else icon="mdi-lock-reset" />
        </button>
      </div>
      <div class="reset-password-animation" id="back-login-wrapper">
        <v-btn variant="plain" id="back-login-button" @click="goToLogin">
          返回登录
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "~/ts/request";
import { ElMessage } from "element-plus";
import { animate, spring, stagger } from "animejs";
import { LoginCredientialDto } from "~/types";
import { useMainStore } from "~/store/mainStore";

const route = useRoute();
const router = useRouter();

const store = useMainStore();
const loading = ref(false);
const resetToken = ref("");
const pageNotice = ref("");
const form = ref({
  password: "",
  confirmPassword: "",
});

function goToLogin(): void {
  router.push("/login");
}

function checkPayload(): boolean {
  const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).{8,}$/;

  if (!resetToken.value) {
    pageNotice.value = "重置链接无效，请重新发起找回密码";
    return false;
  }

  if (!form.value.password || !passwordPattern.test(form.value.password)) {
    ElMessage({
      type: "error",
      message: "密码需包含大写字母、小写字母、数字和特殊字符，且不少于8位",
    });
    return false;
  }

  if (form.value.password !== form.value.confirmPassword) {
    ElMessage({
      type: "error",
      message: "两次输入的密码不一致",
    });
    return false;
  }

  return true;
}

async function submit(): Promise<void> {
  if (!checkPayload()) {
    return;
  }

  loading.value = true;
  try {
    const res = await axios.put<LoginCredientialDto>(`/authentication/password`, {
      passwordResetToken: resetToken.value,
      password: form.value.password,
    });
    if (res.status === 200) {
      ElMessage({
        type: "success",
        message: "密码重置成功",
      });
      store.login(res.data);
      router.push("/user/detail");
    }
  } catch (error) {
    console.log(error);
    ElMessage({
      type: "error",
      message: "密码重置失败，请重新获取邮件链接",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const queryToken = route.query.token;
  if (typeof queryToken === "string") {
    resetToken.value = queryToken;
  }
  if (!resetToken.value) {
    pageNotice.value = "重置链接无效，请重新发起找回密码";
  }
  animate("#reset-password-main", {
    translateY: [-20, 0],
    opacity: [0, 1],
    ease: spring(),
  });
  nextTick(()=>{
    animate(".reset-password-animation", {
    translateX: [20, 0],
    opacity: [0, 1],
    delay: stagger(100),
    ease: spring(),
  });
  })
});
</script>

<style lang="scss" scoped>
@keyframes loading-icon-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

#reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

#reset-password-main {
  width: min(420px, 90vw);
  height: min(480px, 90vh);
  padding: 24px;
  border: solid 1px var(--bd-color);
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#reset-password-alert {
    max-height: 60px;
}

#reset-password-title {
  font-size: 34px;
  margin-bottom: 16px;
  margin-top: 16px;
}

#reset-password-button-wrapper {
  margin-top: 16px;
  margin-bottom: 8px;
}

#reset-password-button {
  width: 64px;
  height: 64px;
  border-radius: 15px;
  outline: none;
  border: none;
  box-shadow: 0 5px 0 var(--login-button-bd);
  background-color: var(--login-button-bg);
  transition: 0.2s;
  cursor: pointer;
}

#reset-password-button:hover {
  background-color: var(--login-button-hover);
}

#reset-password-button:active {
  box-shadow: 0 1px 0 #999;
  transform: translateY(4px);
}

.reset-password-button-active {
  background-color: var(--login-button-hover);
}

#back-login-wrapper {
  margin-top: 6px;
}

#back-login-button {
  color: #409eff;
}

.is-loading {
  animation: loading-icon-spin 1s infinite linear;
}
</style>
