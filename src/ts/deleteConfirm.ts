import { createVNode, render } from 'vue';
import DeleteConfirm from '@/components/DeleteConfirm.vue';
import { context } from '~/main';

function deleteConfirm(name: string, input: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const vnode = createVNode(DeleteConfirm, {
      name,
      input,
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

export default deleteConfirm;
