import type { Group } from "~/types";
import { del, get, post, put } from "~/api/http/request";
import {
  validateCreateGroupPayload,
  validateGroupId,
  validateGroupMemberIds,
  validateUpdateGroupPayload,
} from "~/api/validation/group.validation";
import { validateUserId } from "~/api/validation/user.validation";

export interface CreateGroupPayload {
  name: string;
  description: string;
}

export interface UpdateGroupPayload {
  name: string;
  description: string;
}

export function getGroupList(params?: { pageNumber?: number; pageSize?: number }) {
  return get<Group[]>("/group", {
    params:
      params
        ? {
            pagenumber: params.pageNumber,
            pagesize: params.pageSize,
          }
        : undefined,
  });
}

export function createGroup(payload: CreateGroupPayload) {
  return post<Group, CreateGroupPayload>("/group", validateCreateGroupPayload(payload));
}

export function updateGroup(groupId: string, payload: UpdateGroupPayload) {
  return put<void, UpdateGroupPayload>(
    `/group/${validateGroupId(groupId)}`,
    validateUpdateGroupPayload(payload)
  );
}

export function deleteGroup(groupId: string) {
  return del<void>(`/group/${validateGroupId(groupId)}`);
}

export function addGroupMembers(groupId: string, memberIds: string[]) {
  return post<void, string[]>(
    `/group/distribution/${validateGroupId(groupId)}`,
    validateGroupMemberIds(memberIds)
  );
}

export function removeGroupMembers(groupId: string, memberIds: string[]) {
  return del<void, string[]>(`/group/distribution/${validateGroupId(groupId)}`, {
    data: validateGroupMemberIds(memberIds),
  });
}

export function getUserGroups(userId: string, examId?: string) {
  return get<Group[]>(`/user/groups/${validateUserId(userId)}`, {
    params: examId ? { examId: validateGroupId(examId) } : undefined,
  });
}
