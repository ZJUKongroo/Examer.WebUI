import type { AddUserDetailDto, User, UserDetailDto } from "~/types";
import { put, get } from "~/api/http/request";
import { usePagination } from "~/composables/usePagination";

export interface GetUserListParams {
  pageNumber: number;
  pageSize: number;
}

export interface UserListResult {
  items: User[];
  totalCount: number;
}

export async function getUserList(params: GetUserListParams): Promise<UserListResult> {
  const response = await get<User[]>("/user", {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  });

  return {
    items: response.data,
    totalCount: usePagination(response.headers),
  };
}

export async function getUserDetail(userId?: string): Promise<UserDetailDto> {
  const path = userId ? `/user/detail/${userId}` : "/user/detail/me";
  const response = await get<UserDetailDto>(path);
    return response.data;
}

export async function updateUserDetail(payload: AddUserDetailDto, userId?: string): Promise<void> {
  const path = userId ? `/user/detail/${userId}` : "/user/detail/me";
  await put<void, AddUserDetailDto>(path, payload);
    return;
}
