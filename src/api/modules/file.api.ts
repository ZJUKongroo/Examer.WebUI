import type { AxiosProgressEvent } from "axios";
import type { CommitFile } from "~/types";
import { del, get, post } from "~/api/http/request";
import { validateCreateFilePayload, validateFileId } from "~/api/validation/file.validation";

export interface CreateFilePayload {
  parentId: string;
  fileType: number;
}

export interface FileRecord {
  id: string;
  fileName: string;
  fileType: number;
}

export function createFileRecord(payload: CreateFilePayload) {
  return post<FileRecord, CreateFilePayload>("/file", validateCreateFilePayload(payload));
}

export function uploadFileBlob(
  fileId: string,
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
  return post<void, FormData>(`/file/blob/${validateFileId(fileId)}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

export function downloadFileBlob(fileId: string) {
  return get<Blob>(`/file/blob/${validateFileId(fileId)}`, {
    responseType: "blob",
  });
}

export function deleteFile(fileId: string) {
  return del<void>(`/file/${validateFileId(fileId)}`);
}

export function openCommitFileBlob(file: CommitFile) {
  return downloadFileBlob(file.id.trim());
}
