<template>
  <div class="tree-container">
    <vue-draggable-next
      v-model="treeData"
      group="nodes"
      itemKey="id"
      :move="onMove"
      @end="onEnd"
    >
      <TreeOrg :data="treeData" :collapsible="true" node-content="node-content">
        <template #node-content="{ node }">
          <div class="node" :key="node.id" @click="selectNode(node)">
            {{ node.label }}
          </div>
        </template>
      </TreeOrg>
    </vue-draggable-next>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import TreeOrg from 'vue3-tree-org';
import { VueDraggableNext } from 'vue-draggable-next';

export default defineComponent({
  components: {
    TreeOrg,
    VueDraggableNext,
  },
  setup() {
    const treeData = ref([
      {
        id: 1,
        label: 'Root Node',
        children: [
          {
            id: 2,
            label: 'Child Node 1',
            children: [{ id: 4, label: 'Grandchild Node' }],
          },
          { id: 3, label: 'Child Node 2' },
        ],
      },
    ]);

    const onMove = (event) => {
      // Customize drag behavior if necessary
      return true; // Allow movement
    };

    const onEnd = (event) => {
      // Handle the drop event, update data, etc.
      console.log('Drag ended:', event);
    };

    const selectNode = (node) => {
      console.log('Selected node:', node);
    };
    onMounted(() => {
      console.log('tree-org is now mounted');
    });
    return {
      treeData,
      onMove,
      onEnd,
      selectNode,
    };
  },
});
</script>

<style scoped>
.tree-container {
  padding: 20px;
}

.node {
  padding: 8px;
  border: 1px solid #ccc;
  background-color: #fafafa;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 5px;
  text-align: center;
}
</style>
