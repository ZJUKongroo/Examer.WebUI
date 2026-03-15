import type { CreateFilePayload } from "~/api/modules/file.api";
import { assertFiniteNumber, assertNonEmptyString } from "~/api/validation/common";

export function validateFileId(fileId: string): string {
  return assertNonEmptyString(fileId, "文件ID");
}

export function validateCreateFilePayload(payload: CreateFilePayload): CreateFilePayload {
  const parentId = assertNonEmptyString(payload.parentId, "父记录ID");
  const fileType = assertFiniteNumber(payload.fileType, "文件类型");
  return { parentId, fileType };
}
