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


