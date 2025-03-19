<!-- 未认证页面 -->

<script setup lang="ts">
import anime from "animejs";
import { onMounted } from "vue";
import { useMainStore } from "~/store/mainStore";

const store = useMainStore();
const backHome = () => {
  store.logout();
};

onMounted(() => {
  anime({
    targets: ".unauthorized-view-anime",
    translateX: [-30, 0],
    opacity: [0, 1],
    delay: anime.stagger(50),
  });
});
</script>

<template>
  <div class="unauthorized-view">
    <div class="unauthorized-view-content">
      <h1 class="unauthorized-view-anime">401</h1>
      <h2 class="unauthorized-view-anime">Unauthorized</h2>
      <p class="unauthorized-view-anime">对不起，您没有权限访问此页面。</p>
      <div class="unauthorized-view-anime"><v-btn @click="backHome" color="primary">返回首页</v-btn></div>
    </div>
  </div>
</template>

<style>
.unauthorized-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-color);
}

.unauthorized-view-content {
  text-align: center;
}

.unauthorized-view-content h1 {
  font-size: 100px;
  margin: 0;
  color: var(--text-color);
}

.unauthorized-view-content h2 {
  font-size: 24px;
  margin: 0;
  color: var(--text-color);
}

.unauthorized-view-content p {
  font-size: 16px;
  margin: 10px;
  color: var(--text-color);
}
</style>