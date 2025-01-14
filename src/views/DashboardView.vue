<template>
<div id="main-view">
  <div id="main-view-sidebar">
    <MainSidebar /> 
  </div>
  <div id="main-view-content">
    <div id="main-view-wrapper">
      <router-view />
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import MainSidebar from "~/components/MainSidebar.vue";
</script>

<style >
</style>