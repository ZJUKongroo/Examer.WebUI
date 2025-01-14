import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus';

const instance = axios.create({
  baseURL: "./api",
  timeout: 6000,
})

instance.interceptors.request.use(
  config => {
    let validToken = false;
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    if (token && expiration) {
      if ((new Date()) < (new Date(expiration))) {
        config.headers.Authorization = `Bearer ${token}`;
        validToken = true;
      }
    }
    if (!validToken && config.url != "/Authentication/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      router.push("/login")
      ElMessage({
        type: "warning",
        message: "登录状态已过期"
      })
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: typeof instance
  }
}

export default instance;