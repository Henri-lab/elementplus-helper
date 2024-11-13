// Add a child node
const addNode = (parentNodeId: number | undefined, newNode: Tree) => {
  const parentNode = findNode(data.value, parentNodeId);
  if (parentNode) {
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode);
    data.value = [...data.value];
    // After updating the data, set the new node as the current one
    // nextTick(() => {
    //   if (treeRef.value) {
    //     treeRef.value.setCurrentKey(newNode.id);
    //   }
    // });
  } else {
    console.warn('Parent node not found when add a newNode');
  }
};