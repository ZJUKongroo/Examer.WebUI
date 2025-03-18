import { ElMessage } from 'element-plus';
import axios from './request'
interface FileDto {
    id: string
    fileName: string,
    fileType: number
}

export async function fileUploadAsync(file:File,commitId:string,progressCallback:(progress:number)=>void){
    const formData = new FormData();
    formData.append("formFile", file);
    progressCallback(0)
    // 先通过接口获取文件记录 ID
    const { data } = await axios.post<FileDto>("/file", {
      parentId: commitId,
      fileType: 2
    });
    try {
      // 上传文件实际内容，绑定上传进度
      await axios.post(`/file/blob/${data.id}`, formData, {
        headers: {
          // 注意：不建议手动设置 Content-Type，浏览器会自动添加 boundary
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            progressCallback(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });
      // 上传完成后确认提交
      
    } catch (e) {
      // 如果上传失败，则删除中间记录，并显示错误提示
      // await axios.delete(`/file/${data.id}`);
      ElMessage.error(`上传失败：${file.name}`);
      throw e;
    }
  }