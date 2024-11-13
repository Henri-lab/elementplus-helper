import type { ITreeNode } from '../interface';
import { findNode } from './find';
type TreeNode = ITreeNode;

export const updateNode = (arg: any) => {
  const node = findNode(arg.data.value,arg.nodeId);
  if (node) {
    Object.assign(node, arg.updatedProperties);
  } else {
    console.warn('Node not found');
  }
};
