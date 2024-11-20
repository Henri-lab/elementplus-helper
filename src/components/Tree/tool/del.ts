import { ref } from 'vue';
import type { ITreeNode, IOperationParams } from '../interface';
import { ElMessage } from 'element-plus';
import { findNode, findParentNode } from './find';
type TreeNode = ITreeNode;

// Delete a node by ID
export const deleteNode = ({ nodesRef, nodeId }: IOperationParams): boolean => {
  const nodes = nodesRef.value;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      nodes.splice(i, 1);
      nodesRef.value = [...nodes]; // Trigger reactivity
      return true;
    } else if (nodes[i].children) {
      const deleted = deleteNode({
        //@ts-ignore
        nodesRef: { value: nodes[i].children },
        nodeId,
      });
      if (deleted) return true;
    }
  }
  return false;
};

export const deleteNodeWithHistory = ({
  nodesRef,
  nodeId,
  historyStack = ref([]),
}: IOperationParams) => {
  const parentNode = findParentNode({ nodesRef, nodeId });
  const nodeData = findNode({ nodesRef, nodeId });
  if (!parentNode) {
    const index = nodesRef.value.findIndex((node) => node.id === nodeId);
    if (index !== -1) {
      const deletedNode = nodesRef.value.splice(index, 1);
      historyStack.value.push({
        action: 'delete',
        payload: {
          parentId: 'root',
          nodeData: { ...deletedNode[0] },
        },
      });
      return true;
    }
    ElMessage.error('节点删除失败');
    return false;
  }

  if (nodeData && parentNode) {
    const index = parentNode.children?.findIndex((node) => node.id === nodeId);
    if (index !== undefined && index > -1 && parentNode.children) {
      parentNode.children.splice(index, 1);
      // 保存删除操作的历史记录，包括父节点 ID 和节点数据
      historyStack.value.push({
        action: 'delete',
        payload: {
          parentId: parentNode.id,
          nodeData: { ...nodeData },
        },
      });
      ElMessage.success('节点删除成功');
      return true;
    }
  }
  ElMessage.error('节点删除失败');
  return false;
};
