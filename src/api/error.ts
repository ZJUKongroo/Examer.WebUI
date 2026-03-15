import type { HttpError } from "~/api/http/request";
import appMessage from "~/services/message.service";

export interface HandleApiErrorOptions {
  fallbackMessage?: string;
  statusMessages?: Partial<Record<number, string>>;
  silent?: boolean;
}

function isHttpError(error: unknown): error is HttpError {
  return !!error && typeof error === "object" && "message" in error;
}

export function getApiErrorMessage(
  error: unknown,
  options?: HandleApiErrorOptions
): string {
  const fallbackMessage = options?.fallbackMessage || "请求失败，请稍后重试";
  const statusMessages = options?.statusMessages || {};

  if (isHttpError(error)) {
    const status = error.status;
    if (status && statusMessages[status]) {
      return statusMessages[status] as string;
    }

    if (status === 401) return "登录状态已过期，请重新登录";
    if (status === 403) return "无权限执行该操作";
    if (status === 404) return "请求资源不存在";
    if (status === 409) return "数据冲突，请刷新后重试";
    if (status === 422) return "提交的数据格式不正确";
    if (status && status >= 500) return "服务器错误，请稍后重试";

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function handleApiError(
  error: unknown,
  options?: HandleApiErrorOptions
): string {
  const message = getApiErrorMessage(error, options);
  if (!options?.silent) {
    appMessage.error(message)
  }
  return message;
}
