<template>
  <div id="main-view">
    <div id="main-view-sidebar">
      <SuperAdminSidebar v-if="store.userRole===UserRole.SuperAdministrator"/>
      <AdminSidebar v-else-if="store.userRole===UserRole.Administrator"/>
      <MainSidebar v-else/>
    </div>
    <div id="main-view-content">
      <div id="main-view-header">
        <v-menu transition="scale-transition">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="tonal"> 张三 </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>退出</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div id="main-view-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import MainSidebar from "~/components/MainSidebar.vue";
import AdminSidebar from "~/components/AdminSidebar.vue";
import SuperAdminSidebar from "~/components/SuperAdminSidebar.vue";
import { useMainStore } from "~/store/mainStore";
import { entry } from "~/ts/entry";
import { UserRole } from "~/enums";

const store = useMainStore();
const router = useRouter();

function logout() {
  store.logout();
  router.push("/login");
}

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
  height: calc(100% - 50px);
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
