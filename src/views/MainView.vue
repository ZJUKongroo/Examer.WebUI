<template>
  <div id="main-view">
    <div id="main-view-sidebar">
      <SuperAdminSidebar v-if="store.userRole===UserRole.SuperAdministrator"/>
      <AdminSidebar v-else-if="store.userRole===UserRole.Administrator"/>
      <MainSidebar v-else/>
      <!-- 根据用户替换导航条 -->
    </div>
    <div id="main-view-content">
      <div id="main-view-wrapper" :style="watermarkStyle">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import MainSidebar from "~/components/MainSidebar.vue";
import AdminSidebar from "~/components/AdminSidebar.vue";
import SuperAdminSidebar from "~/components/SuperAdminSidebar.vue";
import { useMainStore } from "~/store/mainStore";
import { entry } from "~/services/transition.service";
import { UserRole } from "~/enums";

const store = useMainStore();

const watermarkStyle = computed(() => {
  const text = store.userId || "";
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;

  const context = canvas.getContext("2d");
  if (!context || !text) {
    return {};
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((-20 * Math.PI) / 180);
  context.fillStyle = store.isDarkMode
    ? "rgba(255, 255, 255, .05)"
    : "rgba(0, 0, 0, .08)";
  context.font = "600 16px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 0, 0);

  return {
    backgroundImage: `url(${canvas.toDataURL("image/png")})`,
    backgroundRepeat: "repeat",
    backgroundPosition: "0 0",
  };
});

onMounted(() => {
  const main = document.getElementById("main-view-content");
  if (main) {
    entry("up", main, 50);
  }
});
</script>

<style>
#main-view {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: var(--bg-color-shallow);
}
#main-view-sidebar {
  width: 200px;
  height: 100vh;
}
#main-view-content {
  flex-grow: 1;
  padding: 18px;
}
#main-view-wrapper {
  background-color: var(--bg-color-solid);
  box-sizing: border-box;
  height: 100%;
  /* padding: 20px; */
  overflow-y: auto;
  border-radius: 17px;
  box-shadow: var(--inset-shadow);
}
#main-view-header {
  height: 50px;
  text-align: right;
}
.main-view-user {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-color);
  border-radius: 10px;
  width: 70px;
  padding: 5px;
  height: 40px;
  line-height: 30px;
  text-align: center;
  box-sizing: border-box;
  background-color: var(--bg-color-shallow);
}
.main-view-user:hover {
  cursor: pointer;
  background-color: var(--bg-color-solid);
}
</style>
