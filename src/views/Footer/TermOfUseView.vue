<template>
  <div id="terms-container">
    <h1>使用条款</h1>
    <p>欢迎使用 ACEE 网站。在使用本网站之前，请仔细阅读以下使用条款。</p>
    
    <h2>1. 接受条款</h2>
    <p>通过访问和使用本网站，您表示同意遵守这些使用条款。如果您不同意这些条款，请勿使用本网站。</p>
    
    <h2>2. 用户行为</h2>
    <p>您同意在使用本网站时不会进行以下行为：</p>
    <ul>
      <li>破坏、篡改、损坏或以其他方式干扰网站的正常运行。</li>
      <li>未经授权访问、篡改或使用网站的后端系统或数据。</li>
      <li>发布或传播任何非法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容。</li>
      <li>侵犯他人的知识产权或其他合法权利。</li>
    </ul>
    
    <h2>3. 知识产权</h2>
    <p>本网站上的所有内容，包括但不限于文本、图像、图形、标志、按钮图标、软件和音频片段，均为 ACEE 或其内容供应商的财产，受版权法和其他知识产权法的保护。</p>
    
    <h2>4. 免责声明</h2>
    <p>本网站及其内容按“现状”提供，不作任何明示或暗示的保证。ACEE 不保证本网站的功能不受干扰或无错误，也不保证本网站或其服务器没有病毒或其他有害成分。</p>
    
    <h2>5. 责任限制</h2>
    <p>在任何情况下，ACEE 对于因使用或无法使用本网站而引起的任何直接、间接、偶然、特殊或后果性损害不承担责任。</p>
    
    <h2>6. 修改条款</h2>
    <p>ACEE 保留随时修改这些使用条款的权利。修改后的条款将在本网站上发布后立即生效。请定期查看这些条款以了解任何更改。</p>
    
    <h2>7. 联系我们</h2>
    <p>如果您对这些使用条款有任何疑问，请通过以下方式联系我们：</p>
    <p>Email: support@acee.com</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import anime from 'animejs';

onMounted(() => {
  anime({
    targets: '#terms-container *',
    opacity: [0, 1],
    translateY: [-50, 0],
    delay: anime.stagger(50),
  });
});
</script>

<style>
#terms-container {
  font-size: 16px;
  width: 100%;
    box-sizing: border-box;
    padding: 30px;
}

#terms-container h1,
h2,
h3,
h4, p, ul, li {
  margin-bottom: 10px;
}

#terms-container ul {
    padding-left: 40px;
}
</style>