import type { CreateGroupPayload, UpdateGroupPayload } from "~/api/modules/group.api";
import {
  assertNonEmptyString,
  assertStringArray,
} from "~/api/validation/common";

export function validateGroupId(groupId: string): string {
  return assertNonEmptyString(groupId, "分组ID");
}

export function validateCreateGroupPayload(payload: CreateGroupPayload): CreateGroupPayload {
  return {
    name: assertNonEmptyString(payload.name, "分组名称"),
    description: payload.description.trim(),
  };
}

export function validateUpdateGroupPayload(payload: UpdateGroupPayload): UpdateGroupPayload {
  return {
    name: assertNonEmptyString(payload.name, "分组名称"),
    description: payload.description.trim(),
  };
}

export function validateGroupMemberIds(memberIds: string[]): string[] {
  return assertStringArray(memberIds, "分组成员ID列表");
}
