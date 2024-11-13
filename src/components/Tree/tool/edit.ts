import { ElMessage } from 'element-plus';
import type { ITreeNode } from '../interface';
import { findNode } from './find';

type TreeNode = ITreeNode;
export const saveLabel = (arg:any) => {
  const updatedNode = findNode(arg.data.value, arg.node.id);
  if (updatedNode) {
    updatedNode.label = arg.nodeEditingValues.value[arg.node.id!];
    ElMessage.success('修改成功');
    // Trigger reactivity by ‘replacing the array’
    arg.data.value = [...arg.data.value];
  }
  arg.nodeEditingStatus.value[arg.node.id!] = false;
};