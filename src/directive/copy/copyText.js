/**
 * v-copyText - 一个Vue.js指令，用于轻松实现文本复制功能。
 * 版权所有 © 2022 ruoyi
 */

// 导出一个Vue插件作为指令
export default {
  // 在挂载指令之前设置必要的逻辑
  beforeMount(el, { value, arg }) {
    // 如果参数是 "callback"，则将回调函数存储在元素属性中
    if (arg === "callback") {
      el.$copyCallback = value;
    } else {
      // 否则，存储要复制的文本，并设置点击事件处理器
      el.$copyValue = value;

      // 定义点击事件处理器
      const handler = () => {
        // 调用复制文本到剪贴板的函数
        copyTextToClipboard(el.$copyValue);

        // 如果定义了回调函数，则调用它并传递复制的文本
        if (el.$copyCallback) {
          el.$copyCallback(el.$copyValue);
        }
      };

      // 为元素添加点击事件监听器
      el.addEventListener("click", handler);

      // 存储一个方法以在清理时移除事件监听器
      el.$destroyCopy = () => el.removeEventListener("click", handler);
    }
  }
};

// 复制文本到剪贴板的函数
function copyTextToClipboard(input, options = {}) {
  const { target = document.body } = options; // 默认目标为 body 元素

  // 创建一个文本区域元素来保存文本
  const element = document.createElement('textarea');

  // 设置文本区域的值为输入的文本
  element.value = input;

  // 防止移动设备上键盘弹出，设置只读属性
  element.setAttribute('readonly', '');

  // 样式化文本区域使其隐藏
  element.style.contain = 'strict';
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.fontSize = '12pt'; // 防止 iOS 上的缩放

  // 记录当前聚焦的元素
  const previouslyFocusedElement = document.activeElement;

  // 获取当前的选择
  const selection = document.getSelection();

  // 保存原始的选择范围（如果存在）
  const originalRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  // 将文本区域附加到目标元素
  target.appendChild(element);

  // 选择文本区域中的所有文本
  element.select();

  // 明确设置 iOS 兼容的选择开始和结束位置
  element.selectionStart = 0;
  element.selectionEnd = input.length;

  // 尝试复制选定的文本
  let isSuccess = false;
  try {
    isSuccess = document.execCommand('copy');
  } catch (error) {
    console.error('复制文本失败:', error);
  }

  // 移除临时创建的文本区域
  target.removeChild(element);

  // 如果存在原始的选择范围，则恢复原始的选择
  if (originalRange) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }

  // 将焦点返回到先前聚焦的元素
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }

  // 返回复制操作是否成功的布尔值
  return isSuccess;
}