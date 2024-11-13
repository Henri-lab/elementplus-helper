import type { ITreeNode,OperationParams } from '../interface';
type TreeNode = ITreeNode;

// Delete a node by ID
export const deleteNode = ({ nodesRef, nodeId }: OperationParams): boolean => {
    const nodes = nodesRef.value;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === nodeId) {
        nodes.splice(i, 1);
        nodesRef.value = [...nodes]; // Trigger reactivity
        return true;
      } else if (nodes[i].children) {
        const deleted = deleteNode({ nodesRef: { value: nodes[i].children }, nodeId });
        if (deleted) return true;
      }
    }
    return false;
  };