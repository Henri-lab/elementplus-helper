import { ref } from 'vue';
import type { ITreeNode, IOperationParams } from '../interface';
type TreeNode = ITreeNode;
// Find a node by ID
export const findNode = ({
  nodesRef,
  nodeId,
}: IOperationParams): TreeNode | null => {
  const nodes = nodesRef.value;
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node; // Node found
    }
    if (node.children) {
      // Recursive search in children nodes
      const found = findNode({ nodesRef: ref(node.children), nodeId });
      if (found) {
        return found;
      }
    }
  }
  return null; // Node not found
};

// findParentNode: 在树结构中找到指定节点的父节点
export const findParentNode = ({
  nodesRef,
  nodeId,
}: IOperationParams): ITreeNode | null => {
  let nodes = nodesRef.value;
  const targetNodeId = nodeId;
  for (const node of nodes) {
    if (node.children) {
      const childIndex = node.children.findIndex(
        (child) => child.id === targetNodeId
      );
      if (childIndex !== -1) {
        return node; // 找到父节点
      }
      // 递归查找子节点
      const foundParent = findParentNode({
        nodesRef: ref(node.children),
        nodeId: targetNodeId,
      });
      if (foundParent) return foundParent;
    }
  }
  return null; // 没有找到
};
