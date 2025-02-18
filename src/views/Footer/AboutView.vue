<template>
  <div id="about-container">
    <h1>关于我们</h1>
    <p>ACEE 是一个致力于提供高质量教育资源的平台。我们通过创新的技术和优质的内容，帮助学生和教育者实现他们的目标。</p>
    <h2>ZJUKongroo</h2>
    <p>ZJUKongroo 工作室由 ACEE 的成员组成，致力于为用户提供最佳的学习体验。我们的考试系统专为 ACEE 炸生设计，旨在提供高效流畅一致的试题提交体验。</p>
    <h2>我们的考试系统</h2>
    <p>我们的考试系统专注于高效与流畅的用户体验。</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import anime from 'animejs';

onMounted(() => {
  anime({
    targets: '#about-container *',
    opacity: [0, 1],
    translateY: [-50, 0],
    delay: anime.stagger(50),
  });
});
</script>

<style>
#about-container {
  font-size: 16px;
  padding: 30px;
}

#about-container h1,
h2,
h3,
h4,p {
  margin-bottom: 10px;
}
</style>