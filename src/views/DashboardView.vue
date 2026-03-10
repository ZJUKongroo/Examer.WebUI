<template>
    <div id="dashboard-view">
      <div id="dashboard-view-bg"></div>
      <div id="dashboard-view-content">
        <h1>ACEE Commitment System</h1>
        <h1>ACEE 试题提交系统</h1>
        <p>欢迎来到 ACEE 试题提交系统 <<< </p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { animate, spring, stagger } from 'animejs';
  import { onMounted } from 'vue';
  
  onMounted(() => {
    animate("#dashboard-view-content *", {
      translateX: [20, 0],
      opacity: [0, 1],
      ease: spring(),
      delay: stagger(80),
    })
    animate("#dashboard-view-bg", {
      translateY: [20, 0],
      opacity: [0, 1],
      ease: spring()
    })
  })
  </script>
  
  <style>
  #dashboard-view {
    padding: 40px;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  #dashboard-view-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-image: url('~/assets/img/homepage_background.png');
    background-size: 100%;
    background-position: bottom;
  }
  
  #dashboard-view-content{
    font-size: 23px;
  }
  
  #dashboard-view h1,
  h2,
  h3,
  h4 {
    margin-bottom: 10px;
  }
  </style>