<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { entry } from "~/ts/entry";

const router = useRouter();
const backHome = () => {
  router.back();
};
onMounted(() => {
  const content = document.getElementById(
    "unauthorized-view-content"
  ) 
  if (content) entry("left", content, 50);
});
</script>

<template>
  <div id="unauthorized-view">
    <div id="unauthorized-view-content">
      <h1>401</h1>
      <h2>Unauthorized</h2>
      <p>对不起，您没有权限访问此页面。</p>
      <v-btn @click="backHome" color="primary">返回首页</v-btn>
    </div>
  </div>
</template>

<style>
    #unauthorized-view {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: var(--bg-color);
    }
    
    #unauthorized-view-content {
        text-align: center;
    }
    
    #unauthorized-view-content h1 {
        font-size: 100px;
        margin: 0;
        color: var(--text-color);
    }
    
    #unauthorized-view-content h2 {
        font-size: 24px;
        margin: 0;
        color: var(--text-color);
    }
    
    #unauthorized-view-content p {
        font-size: 16px;
        margin: 10px;
        color: var(--text-color);
    }
    </style>