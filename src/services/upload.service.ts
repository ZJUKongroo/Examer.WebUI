import { createFileRecord, deleteFile, uploadFileBlob } from "~/api";
import { handleApiError } from "~/api/error";

export async function fileUploadAsync(
  file: File,
  commitId: string,
  progressCallback: (progress: number) => void
): Promise<void> {
  const formData = new FormData();
  formData.append("formFile", file);
  progressCallback(0);

  const { data } = await createFileRecord({
    parentId: commitId,
    fileType: 2,
  });

  try {
    await uploadFileBlob(data.id, formData, (progressEvent) => {
      if (progressEvent.total) {
        progressCallback(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    });
  } catch (error) {
    await deleteFile(data.id);
    handleApiError(error, { fallbackMessage: `上传失败：${file.name}` });
    throw error;
  }
}
