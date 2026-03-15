import type { CommitFile } from "~/types";
import { openCommitFileBlob } from "~/api";
// import { handleApiError } from "~/api/error";
import { renderAsync } from "docx-preview";
import appMessage from "./message.service";
import { handleApiError } from "~/api/error";
import { confirmDialog } from "./dialog.service";

const previewFileType = ["jpg", "jpeg", "png", "pdf", "tiff", "webp", "mp4", "mp3", "txt", "gif", "wav", "docx"];

export function openFile(file: CommitFile): void {
  const fileExtension = file.fileName.split(".").pop()?.toLowerCase();

  appMessage.queue("获取文件", new Promise<void>(async (resolve, reject) => {
    openCommitFileBlob(file)
      .then((response) => {
        const blob: Blob = response.data;
        const url = URL.createObjectURL(
          new Blob([blob], {
            type: response.headers["content-type"] as string,
          })
        );

        resolve();

        if (fileExtension === "docx") {
          confirmDialog({
            title: "预览",
            message: `是否预览 \"${file.fileName}\"？`,
            confirmText: "预览",
            cancelText: "下载",
            confirmColor: "primary",
          }).then((shouldPreview) => {
            if (shouldPreview) {
              previewDocxFile(blob, file);
            } else {
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", file.fileName);
              link.click();
            }
            window.URL.revokeObjectURL(url);
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
        handleApiError(error, { fallbackMessage: "文件获取失败",silent:true });
        reject(error);
      });
  }));
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
