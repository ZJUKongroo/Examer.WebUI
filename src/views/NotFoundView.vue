<!-- 404 页面 -->

<template>
  <div id="not-found-view">
    <div id="not-found-view-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>对不起，您访问的页面不存在。</p>
      <v-btn @click="backHome" color="primary">返回首页</v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { entry } from "~/ts/entry";

const router = useRouter();

const backHome = () => {
  router.back();
};

onMounted(() => {
  const content = document.getElementById(
    "not-found-view-content"
  ) as HTMLElement;
  entry("left", content, 50);
});
</script>

<style scoped>
#not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--bg-color);
}

#not-found-view-content {
  text-align: center;
}

#not-found-view-content h1 {
  font-size: 100px;
  margin: 0;
  color: var(--text-color);
}

#not-found-view-content h2 {
  font-size: 24px;
  margin: 0;
  color: var(--text-color);
}

#not-found-view-content p {
  font-size: 16px;
  margin: 10px;
  color: var(--text-color);
}
</style>
