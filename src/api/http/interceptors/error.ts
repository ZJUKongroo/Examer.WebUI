import type { AxiosInstance } from "axios";

export function setupErrorInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
}
