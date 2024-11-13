import { ref, type Ref } from 'vue';
import type { IOperationParams, ITreeNode } from '../interface';
import { findNode } from './find';
import { ElMessage } from 'element-plus';
import { deleteNode } from './del';
type TreeNode = ITreeNode;

export const updateNode = ({
  nodesRef,
  nodeId,
  updatedProperties,
}: IOperationParams): boolean => {
  const node = findNode({ nodesRef, nodeId });
  if (node && updatedProperties) {
    Object.assign(node, updatedProperties); // Update properties of the node
    nodesRef.value = [...nodesRef.value]; // Trigger reactivity
    return true;
  }
  console.warn('Node not found or no properties to update');
  return false;
};
// saveLabel essentially performs an update operation on a single property (label)
export const saveLabel = ({
  nodesRef,
  nodeId,
  newLabel,
}: IOperationParams): boolean => {
  if (!nodeId || !newLabel) {
    console.warn('Node ID and new label are required');
    return false;
  }

  const node = findNode({ nodesRef, nodeId });
  if (node) {
    node.label = newLabel; // Update the node's label
    nodesRef.value = [...nodesRef.value]; // Trigger reactivity by updating the array
    return true;
  } else {
    console.warn('Node not found');
    return false;
  }
};

// 撤销操作方法
export const undoAction = ({
  nodesRef,
  historyStack = ref([]),
}: IOperationParams) => {
  if (historyStack.value.length === 0) {
    ElMessage.info('没有操作可撤销');
    return;
  }

  const lastAction = historyStack.value.pop();
  if (!lastAction) return;

  const { action, payload } = lastAction;
  if (action === 'add') {
    deleteNode({ nodesRef: nodesRef, nodeId: payload.id });
    ElMessage.success('撤销添加');
  } else if (action === 'update') {
    saveLabel({
      nodesRef: nodesRef,
      nodeId: payload.id,
      newLabel: payload.previousLabel,
    });
    ElMessage.success('撤销更新');
  }
};

// function cancelEditingAll(e: any) {
//   e.stopPropagation();
//   const className = e.target.className;
//   // console.log(e.target.className);
//   // Check if the click is outside the tree container
//   if (
//     treeContainerRef.value &&
// (!treeContainerRef.value.contains(e.target as Node))
//   ) {
//     // If clicked outside, cancel editing for all nodes
//     data.value.forEach((node) => {
//       nodeEditingStatus.value[node.id!] = false;
//     });
//   }
// }
// onMounted(() => {
//   document.addEventListener('dblclick', cancelEditingAll);
// });
// onBeforeMount(() => {
//   document.removeEventListener('dblclick', cancelEditingAll);
// });
