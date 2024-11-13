import type { Ref } from 'vue';
import type { ITreeNode, IOperationParams } from '../interface';
import { findNode } from './find';
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

// After updating the data, set the new node as the current one
// nextTick(() => {
//   if (treeRef.value) {
//     treeRef.value.setCurrentKey(newNode.id);
//   }
// });
