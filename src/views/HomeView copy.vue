<template>
  <div id="home-view">
    <section id="home-view-content">
      <p class="eyebrow">ACEE Platform</p>
      <h1>Commitment System</h1>
      <h2>试题提交系统</h2>

      <div class="warning-texts">
        <p class="warning-title">Security Banner</p>
        <p>DO NOT TRY TO BREAK THIS SYSTEM</p>
        <p>Otherwise, your eligibility will be revoked</p>
        <p class="warning-title cn">严正警告</p>
        <p>请不要尝试破坏试题提交系统</p>
        <p>否则，我们将按照规定取消您的资格</p>
      </div>

      <p class="contact">如遇问题，请加入群聊: 757293931</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { animate, spring, stagger } from 'animejs';
import { onMounted } from 'vue';

onMounted(() => {
  animate("#home-view-content *", {
    translateY: [18, 0],
    opacity: [0, 1],
    ease: spring(),
    delay: stagger(70),
  })
  animate(".warning-texts", {
    scale: [0.97, 1],
    opacity: [0, 1],
    duration: 500,
    ease: spring(),
    delay: 160,
  })
})
</script>

<style scoped>
#home-view {
  --home-text-main: #1e293b;
  --home-text-muted: #475569;
  --home-accent: #0f766e;
  --home-warning: #b45309;
  --home-contact: #334155;

  padding: 42px 48px;
  min-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--home-text-main);
  font-family: 'Aptos', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

#home-view-content {
  width: min(860px, 100%);
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.78rem;
  color: var(--home-accent);
  font-weight: 700;
}

h1 {
  margin: 12px 0 2px;
  font-size: clamp(2.1rem, 4vw, 3.4rem);
  line-height: 1.08;
  letter-spacing: 0.01em;
  font-weight: 760;
}

h2 {
  margin: 0 0 24px;
  font-size: clamp(1.2rem, 2.3vw, 1.85rem);
  color: var(--home-text-muted);
  font-weight: 620;
}

.warning-texts {
  margin-top: 4px;
}

.warning-texts p {
  margin: 6px 0;
  font-size: clamp(0.96rem, 1.5vw, 1.08rem);
  line-height: 1.65;
}

.warning-title {
  margin-top: 0;
  color: var(--home-warning);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-weight: 700;
}

.warning-title.cn {
  margin-top: 10px;
  letter-spacing: 0.03em;
  text-transform: none;
}

.contact {
  margin: 20px 0 0;
  font-size: clamp(0.95rem, 1.5vw, 1.04rem);
  color: var(--home-contact);
}

@media (max-width: 720px) {
  #home-view {
    padding: 24px 18px;
  }

  h1 {
    font-size: clamp(1.75rem, 8.2vw, 2.4rem);
  }

  h2 {
    margin-bottom: 18px;
  }

  .warning-texts p {
    line-height: 1.56;
  }
}
</style>