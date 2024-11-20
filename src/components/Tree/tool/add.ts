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
  if (newNode) {
    const parentNode = findNode({ nodesRef, nodeId: parentNodeId });
    if (parentNode) {
      parentNode.children = parentNode.children || [];
      parentNode.children.push(newNode); // Add new node to children
      newNode.parentId = parentNode.id; // Set new node's parentId
      newNode.isRoot = false;
    } else {
      nodesRef.value.push(newNode);
      newNode.parentId = 'root';
      newNode.isRoot = true;
    }
    nodesRef.value = [...nodesRef.value]; // Trigger reactivit
    return true;
  } else {
    console.warn('newNode is missing');
    return false;
  }
};
export const addNodeWithHistory = ({
  nodesRef,
  parentNodeId,
  newNode,
  historyStack,
}: IOperationParams): boolean => {
  // find the parent node

  if (newNode) {
    const parentNode = findNode({ nodesRef, nodeId: parentNodeId });
    if (parentNode) {
      parentNode.children = parentNode.children || [];
      parentNode.children.push(newNode); // Add new node to children
      newNode.parentId = parentNode.id; // Set new node's parentId
      newNode.isRoot = false;
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
      nodesRef.value.push(newNode);
      newNode.parentId = 'root';
      newNode.isRoot = true;
      if (historyStack) {
        historyStack.value.push({
          action: 'add',
          payload: {
            parentId: parentNodeId||'root',
            nodeData: newNode,
            id:newNode.id,
          },
        });
      }
      return false;
    }
  } else {
    ElMessage.error('newNode is missing');
    return false;
  }
};
