import type { CommitFile } from "~/types";
import axios from './request'
import { renderAsync } from 'docx-preview';
import { ElMessage, ElMessageBox, type Action } from "element-plus";

// 添加 docx 到预览类型列表
const PreviewFileType = ["jpg", "jpeg", "png", "pdf", "tiff", "webp", "mp4", "mp3", "txt", "gif", "wav", "docx"];

export function openFile(file: CommitFile) {
  const fileExtension = file.fileName.split('.').pop()?.toLowerCase();
  ElMessage({
    type: 'info',
    message: '正在获取文件...'
  })
  axios.get(`/file/blob/${file.id.trim()}`, { responseType: 'blob' }).then((response) => {
    const blob: Blob = response.data;
    const url = URL.createObjectURL(new Blob([blob], {
      type: response.headers["content-type"] as string
    }));

    // 处理 Word 文档
    if (fileExtension === "docx") {
      // 显示选择对话框
      ElMessageBox.confirm(`是否预览 "${file.fileName}"?`, '预览', {
        confirmButtonText: '预览',
        cancelButtonText: '下载',
        type: 'warning',
        distinguishCancelAndClose: true,
      }).then(() => {
        previewDocxFile(blob, file);
      }).catch((action: Action) => {
        if (action === 'cancel') {
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.fileName);
          link.click();
          window.URL.revokeObjectURL(url);
          return;
        }
      })
    }
    else if (fileExtension && PreviewFileType.includes(fileExtension)) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.fileName);
      link.click();
      window.URL.revokeObjectURL(url);
    }
  });
}

function previewDocxFile(blob: Blob, file: CommitFile) {
    const tempUrl = URL.createObjectURL(blob);
    const newWindow = window.open(tempUrl, '_blank');
    if (newWindow) {
      newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${file.fileName} - 文档预览</title>
            <style>body { margin: 0;  }</style>
          </head>
          <body>
            <div id="docx-container"></div>
          </body>
          </html>
        `);
      newWindow.document.close();
  
      // 将 blob 转为 ArrayBuffer 后渲染
      blob.arrayBuffer().then((buffer) => {
        const container = newWindow.document.getElementById('docx-container');
        if (container) renderAsync(buffer, container, undefined, {
          className: 'docx-viewer',
          inWrapper: true
        });
      });
    }
  }