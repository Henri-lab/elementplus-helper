import type { DirectiveBinding } from 'vue';

const resizableDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const minWidth = binding.value?.minWidth || 100;
    const minHeight = binding.value?.minHeight || 100;

    // 设置右下角的拖动柄
    const resizeHandle = document.createElement('div');
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.background = 'rgba(0, 0, 0, 0.5)';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.right = '0';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.cursor = 'se-resize';
    resizeHandle.style.zIndex = '1';
    el.style.position = 'relative';
    el.appendChild(resizeHandle);

    // 记录开始位置
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    // 开始拖动
    const onMouseDown = (event: MouseEvent) => {
      startX = event.clientX;
      startY = event.clientY;
      startWidth = el.offsetWidth;
      startHeight = el.offsetHeight;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    // 拖动过程中
    const onMouseMove = (event: MouseEvent) => {
      const newWidth = Math.max(startWidth + event.clientX - startX, minWidth);
      const newHeight = Math.max(startHeight + event.clientY - startY, minHeight);
      el.style.width = `${newWidth}px`;
      el.style.height = `${newHeight}px`;
    };

    // 停止拖动
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // 绑定 mousedown 事件到拖动柄
    resizeHandle.addEventListener('mousedown', onMouseDown);
  },
};

export default resizableDirective;