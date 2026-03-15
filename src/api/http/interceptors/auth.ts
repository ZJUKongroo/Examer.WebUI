import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import router from "~/router";
import appMessage from "~/services/message.service";
import { useMainStore } from "~/store/mainStore";

function isAuthEndpoint(url?: string): boolean {
  return !!url && url.toLowerCase().startsWith("/authentication");
}

export function setupAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const store = useMainStore();
      const token = store.token;
      const expirationTime = store.expirationTime;
      const hasValidToken = !!token && !!expirationTime && new Date() < expirationTime;

      if (hasValidToken) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }

      if (!hasValidToken && !isAuthEndpoint(config.url)) {
        store.logout();
        router.push("/login");
        appMessage.warning("登录状态已过期");
        return Promise.reject(new Error("Token expired"));
      }

      (config.headers as Record<string, string>)["If-Modified-Since"] = "";
      return config;
    },
    (error) => Promise.reject(error)
  );
}
