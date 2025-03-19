<!-- 404 页面 -->

<template>
  <div class="not-found-view">
    <div class="not-found-view-content">
      <h1 class="not-found-view-anime">404</h1>
      <h2 class="not-found-view-anime">Page Not Found</h2>
      <p class="not-found-view-anime">对不起，您访问的页面不存在。</p>
      <div class="not-found-view-anime"><v-btn @click="backHome" color="primary">返回首页</v-btn></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import anime from "animejs";
import { useRouter } from "vue-router";

const router = useRouter();
const backHome = () => {
  router.push("/");
};

onMounted(() => {
  anime({
    targets: ".not-found-view-anime",
    translateX: [-30, 0],
    opacity: [0, 1],
    delay:anime.stagger(50),
  });
});
</script>

<style scoped>
.not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-color);
}

.not-found-view-content {
  text-align: center;
}

.not-found-view-content h1 {
  font-size: 100px;
  margin: 0;
  color: var(--text-color);
}

.not-found-view-content h2 {
  font-size: 24px;
  margin: 0;
  color: var(--text-color);
}

.not-found-view-content p {
  font-size: 16px;
  margin: 10px;
  color: var(--text-color);
}
</style>
