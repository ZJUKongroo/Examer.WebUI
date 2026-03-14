import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
import { ElMessage } from "element-plus";

export function usePagination(headers: RawAxiosResponseHeaders | AxiosResponseHeaders): number {
  const rawTotal = headers["x-total-count"];
  if (rawTotal) {
    const total = Number(rawTotal);
    if (Number.isFinite(total)) {
      return total;
    }
  }

  const rawPagination = headers["x-pagination"];
  if (rawPagination && typeof rawPagination === "string") {
    try {
      const pagination = JSON.parse(rawPagination) as { totalCount?: number };
      if (Number.isFinite(pagination.totalCount)) {
        return Number(pagination.totalCount);
      }
    } catch {
      ElMessage.error("解析分页信息失败");
    }
  }

  return 0;
}