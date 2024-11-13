import type { Ref } from 'vue';
import type { IOperationParams, ITreeNode } from '../interface';
import { findNode } from './find';
type TreeNode = ITreeNode;

export const updateNode = ({
  nodesRef,
  nodeId,
  updatedProperties,
}: IOperationParams): boolean => {
  const node = findNode({ nodesRef, nodeId });
  if (node && updatedProperties) {
    Object.assign(node, updatedProperties); // Update properties of the node
    nodesRef.value = [...nodesRef.value]; // Trigger reactivity
    return true;
  }
  console.warn('Node not found or no properties to update');
  return false;
};
// saveLabel essentially performs an update operation on a single property (label)
export const saveLabel = ({
  nodesRef,
  nodeId,
  newLabel,
}: IOperationParams): boolean => {
  if (!nodeId || !newLabel) {
    console.warn('Node ID and new label are required');
    return false;
  }

  const node = findNode({ nodesRef, nodeId });
  if (node) {
    node.label = newLabel; // Update the node's label
    nodesRef.value = [...nodesRef.value]; // Trigger reactivity by updating the array
    return true;
  } else {
    console.warn('Node not found');
    return false;
  }
};

// function cancelEditingAll(e: any) {
//   e.stopPropagation();
//   const className = e.target.className;
//   // console.log(e.target.className);
//   // Check if the click is outside the tree container
//   if (
//     treeContainerRef.value &&
// (!treeContainerRef.value.contains(e.target as Node))
//   ) {
//     // If clicked outside, cancel editing for all nodes
//     data.value.forEach((node) => {
//       nodeEditingStatus.value[node.id!] = false;
//     });
//   }
// }
// onMounted(() => {
//   document.addEventListener('dblclick', cancelEditingAll);
// });
// onBeforeMount(() => {
//   document.removeEventListener('dblclick', cancelEditingAll);
// });
