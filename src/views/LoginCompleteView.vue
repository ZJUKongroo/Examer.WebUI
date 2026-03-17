<template> 
  <div id="register-complete-page">
    <div id="register-complete-card">
      <div id="register-complete-title" class="mb-4">激活并完善个人信息</div>
      <UserDetailForm id="register-complete-form" :form="form" @submit="submitForm" />

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
import { activateAccount, createUserDetail } from "~/api";
import { getApiErrorMessage } from "~/api/error";
import { buildUserDetailPayload, cloneUserDetailToEditForm } from "~/mappers";
import { animate, spring } from "animejs";
import { useMainStore } from "~/store/mainStore";
import type { AddUserDetailDto } from "~/types";
import UserDetailForm from "~/components/UserDetailForm.vue";

const route = useRoute();
const router = useRouter();
const submitting = ref(false);
const noticeMessage = ref("");
const noticeType = ref<"success" | "error">("success");
const store = useMainStore();

function getTokenFromQuery(): string {
  const queryToken = route.query.token;
  return typeof queryToken === "string" ? queryToken.trim() : "";
}

const form = ref<AddUserDetailDto>(cloneUserDetailToEditForm());

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

async function submitForm(): Promise<void> {
  submitting.value = true;
  try {
    const emailActivateToken = getTokenFromQuery();
    const credientials = await activateAccount(emailActivateToken);
    store.login(credientials.data);

    const payload: AddUserDetailDto = buildUserDetailPayload(form.value);

    await createUserDetail(payload);
    router.push("/user/detail");
  } catch (error) {
    noticeType.value = "error";
    noticeMessage.value = getApiErrorMessage(error, {
      fallbackMessage: "提交失败，请检查 token 与表单信息后重试",
    });
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
  position: relative;
  background:
    radial-gradient(circle at 20% 10%, rgba(72, 149, 239, 0.16), transparent 45%),
    radial-gradient(circle at 85% 90%, rgba(6, 214, 160, 0.12), transparent 40%),
    var(--bg-color-shallow);
}

#register-complete-card {
  width: min(800px, 100%);
  border-radius: 18px;
  padding: 28px;
  background: var(--bg-color);
  backdrop-filter: blur(8px);
  box-shadow: var(--out-shadow);
  z-index: 100;
}

// #register-complete-bg{
//   position: fixed;
//   top: 50vh;
//   left: 50vw;
//   transform: translate(-50%, -50%) scale(1.3,1);
//   color: var(--bg-color);
//   opacity: 0.9;
//   font-weight: 800;
//   font-size: 20vw;
//   text-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
//   letter-spacing: 5vw;
//   cursor: none;
// }

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
