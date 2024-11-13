import type { ITreeNode } from '../interface';
type TreeNode = ITreeNode;
// Find a node by ID
export const findNode = (
  nodes: Tree[],
  nodeId: number | undefined
): Tree | null => {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNode(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
};

export const findNodeEditing = (arg: any) => {
  return arg.nodeEditingStatus.value;
};
