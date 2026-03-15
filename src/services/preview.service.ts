import type { CommitFile } from "~/types";
import { openCommitFileBlob } from "~/api";
import { handleApiError } from "~/api/error";
import { renderAsync } from "docx-preview";
import { ElMessage, ElMessageBox, type Action } from "element-plus";

const previewFileType = ["jpg", "jpeg", "png", "pdf", "tiff", "webp", "mp4", "mp3", "txt", "gif", "wav", "docx"];

export function openFile(file: CommitFile): void {
  const fileExtension = file.fileName.split(".").pop()?.toLowerCase();
  ElMessage({
    type: "info",
    message: "正在获取文件...",
  });

  openCommitFileBlob(file)
    .then((response) => {
      const blob: Blob = response.data;
      const url = URL.createObjectURL(
        new Blob([blob], {
          type: response.headers["content-type"] as string,
        })
      );

      if (fileExtension === "docx") {
        ElMessageBox.confirm(`是否预览 "${file.fileName}"?`, "预览", {
          confirmButtonText: "预览",
          cancelButtonText: "下载",
          type: "warning",
          distinguishCancelAndClose: true,
        })
          .then(() => {
            previewDocxFile(blob, file);
          })
          .catch((action: Action) => {
            if (action === "cancel") {
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", file.fileName);
              link.click();
              window.URL.revokeObjectURL(url);
            }
          });
      } else if (fileExtension && previewFileType.includes(fileExtension)) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.fileName);
        link.click();
        window.URL.revokeObjectURL(url);
      }
    })
    .catch((error) => {
      handleApiError(error, { fallbackMessage: "文件获取失败" });
    });
}

function previewDocxFile(blob: Blob, file: CommitFile): void {
  const tempUrl = URL.createObjectURL(blob);
  const newWindow = window.open(tempUrl, "_blank");
  if (!newWindow) {
    return;
  }

  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${file.fileName} - 文档预览</title>
      <style>body { margin: 0; }</style>
    </head>
    <body>
      <div id="docx-container"></div>
    </body>
    </html>
  `);
  newWindow.document.close();

  blob.arrayBuffer().then((buffer) => {
    const container = newWindow.document.getElementById("docx-container");
    if (container) {
      renderAsync(buffer, container, undefined, {
        className: "docx-viewer",
        inWrapper: true,
      });
    }
  });
}
