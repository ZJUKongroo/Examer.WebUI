import { createVNode, render } from "vue";
import ConfirmDialog, { type ConfirmDialogOptions } from "@/components/ConfirmDialog.vue";
import { context } from "~/main";

function confirm(options: ConfirmDialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const vnode = createVNode(ConfirmDialog, {
      options,
      onConfirm: () => {
        resolve(true);
        cleanup();
      },
      onCancel: () => {
        resolve(false);
        cleanup();
      },
    });
    vnode.appContext = context;
    render(vnode, container);

    function cleanup() {
      render(null, container);
      document.body.removeChild(container);
    }
  });
}

export const confirmDialog = confirm;
