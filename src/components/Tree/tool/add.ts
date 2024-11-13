import type { Ref } from 'vue';
import type {
  ITreeNode,
  IOperationParams,
  IHistoryStackItem,
} from '../interface';
import { findNode, findParentNode } from './find';
import { ElMessage } from 'element-plus';
type TreeNode = ITreeNode;
// Add a child node
export const addNode = ({
  nodesRef,
  parentNodeId,
  newNode,
}: IOperationParams): boolean => {
  const parentNode = findNode({ nodesRef, nodeId: parentNodeId });
  if (parentNode && newNode) {
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode); // Add new node to children
    nodesRef.value = [...nodesRef.value]; // Trigger reactivity
    return true;
  }
  console.warn('Parent node not found or newNode is missing');
  return false;
};
export const addNodeWithHistory = ({
  nodesRef,
  parentNodeId,
  newNode,
  historyStack,
}: IOperationParams): boolean => {
  // find the parent node
  const parentNode = findNode({ nodesRef, nodeId: parentNodeId });

  if (parentNode && newNode) {
    // push new node to parent's children
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode);

    // trigger reactivity by pass the array directly
    nodesRef.value = [...nodesRef.value];

    // save the operation to history stack if provided
    if (historyStack) {
      historyStack.value.push({
        action: 'add',
        payload: {
          parentId: parentNodeId,
          nodeData: newNode,
        },
      });
    }
    ElMessage.success('节点已添加');
    return true;
  } else {
    ElMessage.error('未找到父节点');
    return false;
  }
};
// After updating the data, set the new node as the current one
// nextTick(() => {
//   if (treeRef.value) {
//     treeRef.value.setCurrentKey(newNode.id);
//   }
// });
