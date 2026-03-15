import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
import { ElMessage } from "element-plus";
import type { HttpResponse } from "~/api/http/request";
import type { PaginationMetadata } from "~/types";

const emptyPaginationMetadata: PaginationMetadata = {
  totalCount: 0,
  pageSize: 0,
  currentPage: 1,
  totalPages: 0,
  previousPageLink: null,
  nextPageLink: null,
};

export function usePagination(
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
): PaginationMetadata {
  const rawPagination = headers["x-pagination"];
  if (rawPagination && typeof rawPagination === "string") {
    try {
      const pagination = JSON.parse(rawPagination) as Partial<PaginationMetadata>;
      return {
        totalCount: Number.isFinite(Number(pagination.totalCount)) ? Number(pagination.totalCount) : 0,
        pageSize: Number.isFinite(Number(pagination.pageSize)) ? Number(pagination.pageSize) : 0,
        currentPage: Number.isFinite(Number(pagination.currentPage)) ? Number(pagination.currentPage) : 1,
        totalPages: Number.isFinite(Number(pagination.totalPages)) ? Number(pagination.totalPages) : 0,
        previousPageLink: pagination.previousPageLink ?? null,
        nextPageLink: pagination.nextPageLink ?? null,
      };
    } catch {
      ElMessage.error("解析分页信息失败");
    }
  }

  return emptyPaginationMetadata;
}

export async function fetchAllPaginatedItems<T>(
  fetchPage: (pageSize: number) => Promise<HttpResponse<T[]>>,
  initialPageSize: number
): Promise<T[]> {
  let response = await fetchPage(initialPageSize);
  const { totalCount } = usePagination(response.headers);

  if (totalCount > initialPageSize) {
    response = await fetchPage(totalCount);
  }

  return response.data;
}