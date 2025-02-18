<template>
  <div id="home-view">
    <div id="home-view-bg"></div>
    <div id="home-view-content">
      <h1>ACEE Commitment System</h1>
      <h1>ACEE 试题提交系统</h1>
      <h2>BANNER</h2>
      <h3>DO NOT TRY TO BREAK THIS SYSTEM</h3>
      <h3>Otherwise, your eligibility will be revoked</h3>
      <h2>严正警告</h2>
      <h3>请不要尝试破坏试题提交系统</h3>
      <h3>否则，我们将按照规定取消您的资格</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs';
import { onMounted } from 'vue';

onMounted(() => {
  anime({
    targets: "#home-view-content *",
    translateX: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(50),
  })
  anime({
    targets: "#home-view-bg",
    translateY: [20, 0],
    opacity: [0, 1],
  })
})
</script>

<style>

#home-view {
  padding: 30px;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

#home-view-bg {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-image: url('~/assets/img/homepage_background.png');
  background-size: contain;
  background-position: bottom;
}

#home-view-content{
  font-size: 23px;
}

#home-view h1,
h2,
h3,
h4 {
  margin-bottom: 10px;
}
</style>