import axios from "axios";
import router from "../router";
import { ElMessage } from "element-plus";
import { useMainStore } from "~/store/mainStore";

const instance = axios.create({
  baseURL: "/api",
});

instance.interceptors.request.use(
  (config) => {
    const store = useMainStore();
    let validToken = false;
    const token = store.token;
    const expirationTime = store.expirationTime;
    if (token && expirationTime) {
      if (new Date() < expirationTime) {
        config.headers.Authorization = `Bearer ${token}`;
        validToken = true;
      }
    }
    if (
      !validToken &&
      config.url &&
      !config.url.startsWith("/Authentication")
    ) {
      console.log(config.url);
      store.logout();
      router.push("/login");
      ElMessage({
        type: "warning",
        message: "登录状态已过期",
      });
      return Promise.reject(new Error("Token expired"));
    }
    config.headers["If-Modified-Since"] = "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

declare module "vue" {
  interface ComponentCustomProperties {
    $axios: typeof instance;
  }
}

export default instance;
