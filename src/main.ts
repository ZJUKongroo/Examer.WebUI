import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useDarkMode } from "./composables/useDarkMode.ts";
import "./style/basic.scss";
import "./style/global.scss";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

useDarkMode();

export const context = app._context;

app.mount("#app");