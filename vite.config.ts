import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import vuetify from 'vite-plugin-vuetify';
import viteObfuscateFile from 'vite-plugin-javascript-obfuscator';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    viteObfuscateFile({
      exclude: ['node_modules/**',"src/**/*.*"], // 排除不需要混淆的文件
      options: {
        debugProtection: true, // 启用调试保护（防调试）
        debugProtectionInterval: 2000, // 调试保护触发间隔（毫秒）
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src/'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:60708',
        changeOrigin: true,
      },
    },
  },
});

