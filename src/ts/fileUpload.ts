import { createFileRecord, deleteFile, uploadFileBlob } from '~/api';
import { handleApiError } from '~/api/error';

export async function fileUploadAsync(file:File,commitId:string,progressCallback:(progress:number)=>void){
    const formData = new FormData();
    formData.append("formFile", file);
    progressCallback(0)
    // 先通过接口获取文件记录 ID
    const { data } = await createFileRecord({
      parentId: commitId,
      fileType: 2
    });
    try {
      // 上传文件实际内容，绑定上传进度
      await uploadFileBlob(data.id, formData, (progressEvent) => {
          if (progressEvent.total) {
            progressCallback(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      );
    } catch (e) {
      // 如果上传失败，则删除中间记录，并显示错误提示
      await deleteFile(data.id);
      handleApiError(e, { fallbackMessage: `上传失败：${file.name}` });
      throw e;
    }
  }