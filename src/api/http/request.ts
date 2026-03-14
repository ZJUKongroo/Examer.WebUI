import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import client from "~/api/http/client";

export interface HttpError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export type HttpResponse<TResponse> = Pick<
  AxiosResponse<TResponse>,
  "data" | "headers" | "status"
>;

export function normalizeHttpError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return {
      message: responseMessage || error.message || "Request failed",
      status,
      code: error.code,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unknown error" };
}

export async function request<TResponse, TData = unknown>(
  config: AxiosRequestConfig<TData>
): Promise<HttpResponse<TResponse>> {
  try {
    const response = await client.request<TResponse, AxiosResponse<TResponse>, TData>(config);
    return {
      data: response.data,
      headers: response.headers,
      status: response.status,
    };
  } catch (error) {
    throw normalizeHttpError(error);
  }
}

export function get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<TResponse>> {
  return request<TResponse>({ ...config, method: "GET", url });
}

export function post<TResponse, TData = unknown>(
  url: string,
  data?: TData,
  config?: AxiosRequestConfig<TData>
): Promise<HttpResponse<TResponse>> {
  return request<TResponse, TData>({ ...config, method: "POST", url, data });
}

export function put<TResponse, TData = unknown>(
  url: string,
  data?: TData,
  config?: AxiosRequestConfig<TData>
): Promise<HttpResponse<TResponse>> {
  return request<TResponse, TData>({ ...config, method: "PUT", url, data });
}

export function del<TResponse, TData = unknown>(
  url: string,
  config?: AxiosRequestConfig<TData>
): Promise<HttpResponse<TResponse>> {
  return request<TResponse, TData>({ ...config, method: "DELETE", url });
}
