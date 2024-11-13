<template>
  <div ref="treeContainerRef" class="tree-container">
    <el-input
      v-model="filterText"
      style="width: 240px"
      placeholder="Filter keyword"
    />
    <div :id="idOfTree" v-bind="$attrs">
      <el-tree
        ref="treeRef"
        auto-expand-parent
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        :default-expand-all="false"
        :filter-node-method="filterNode"
        @node-click="getClickedNodeInfo"
        @node-contextmenu="handleContextMenu"
      >
        <template #default="{ data, node }">
          <span class="tree-node">
            <div class="checkbox">
              <el-checkbox v-model="data.check" :checked="data.check" />
            </div>
            <!-- Conditionally render label or input based on editing state -->
            <span
              v-if="!nodeEditingStatus[data.id]"
              class="label"
              @dblclick="enableEditing(data, node)"
            >
              {{ data.label }}
            </span>
            <el-input
              v-else
              v-model="nodeEditingValues[data.id]"
              class="label-editing"
              @dblclick="cancelEditing(data, node)"
              @keyup.enter="saveLabel(data, node)"
              @keyup.esc="cancelEditing(data, node)"
            />
            <div class="operations image">
              <el-image :src="connection" style="height: 16px" fit="cover" />
              <el-image
                :src="addone"
                style="height: 16px; margin: 0 5px"
                fit="none"
                @click="addNode(data.id, { id: Date.now(), label: '新节点' })"
              />
              <el-image
                :src="Delete"
                style="height: 16px"
                fit="cover"
                @click="deleteNode(data.id, data)"
              />
            </div>
          </span>
        </template>
      </el-tree>
    </div>

    <!-- 自定义右键菜单 -->
    <div
      v-if="contextMenuVisible"
      class="context-menu"
      :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
    >
      <ul class="ul">
        <li class="li" @click="handleMenuAction('add')">添加子节点</li>
        <li class="li" @click="handleMenuAction('delete')">删除节点</li>
        <li class="li" @click="handleMenuAction('edit')">编辑节点</li>
      </ul>
    </div>

    <div class="test" v-if="props.test">
      <el-divider>treeData</el-divider>
      <br />
      <!-- {{ format_data }} -->
      {{ data }}
      <br />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import { ElTree, ElInput, ElMessage } from 'element-plus';
//@ts-ignore
import connection from '@/assets/image/connection.png';
//@ts-ignore
import addone from '@/assets/image/add-one.png';
//@ts-ignore
import Delete from '@/assets/image/delete.png';
import { def_treeData } from './default';

//convery property 'id' of vdom
import { useAttrs } from 'vue';
const attrs = useAttrs();

interface TreeNode {
  id?: number;
  label: string;
  children?: TreeNode[];
  check?: boolean;
}

const props = defineProps({
  idOfTree: {
    type: String,
    default: 'idOfTree',
  },
  test: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array as () => TreeNode[],
    default: () => def_treeData,
  },
});

const filterText = ref('tree-index');
const treeRef = ref<InstanceType<typeof ElTree>>();
const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedNode = ref<TreeNode | null>(null);
const defaultProps = { children: 'children', label: 'label' };
const data = ref<TreeNode[]>(props.data);
const treeContainerRef = ref<HTMLElement | null>(null);
// Store the editing state of each node by ID
const nodeEditingStatus = ref<Record<number, boolean>>({});
const nodeEditingValues = ref<Record<number, string>>({});

// Watch filter text input and filter nodes accordingly
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = ((value: string, data: TreeNode): boolean => {
  if (!value) return true;
  return data.label.includes(value);
}) as any;

// Handle right-click menu and position it within the component container
const handleContextMenu = (event: MouseEvent, node: TreeNode) => {
  event.preventDefault();
  selectedNode.value = node;

  if (treeContainerRef.value) {
    const containerRect = treeContainerRef.value.getBoundingClientRect();
    menuPosition.value = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    };
    contextMenuVisible.value = true;

    const closeContextMenu = () => {
      contextMenuVisible.value = false;
      document.removeEventListener('click', closeContextMenu);
    };
    document.addEventListener('click', closeContextMenu);
  }
};

// Handle menu actions
const handleMenuAction = (action: string) => {
  if (selectedNode.value) {
    if (action === 'add') {
      addNode(selectedNode.value.id, { id: Date.now(), label: '新节点' });
    } else if (action === 'delete') {
      deleteNode(selectedNode.value.id, data.value);
    } else if (action === 'edit') {
      enableEditing(selectedNode.value);
    }
    contextMenuVisible.value = false;
  }
};

//node operation methods:add delete edit find
// Add a child node
const addNode = (parentNodeId: number | undefined, newNode: TreeNode) => {
  const parentNode = findNode(data.value, parentNodeId);
  if (parentNode) {
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode);
    data.value = [...data.value];
  }
  // After updating the data, set the new node as the current one
  // nextTick(() => {
  //   if (treeRef.value) {
  //     treeRef.value.setCurrentKey(newNode.id);
  //   }
  // });
};
// Delete a node
const deleteNode = (nodeId: number | undefined, nodes: TreeNode[]) => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      nodes.splice(i, 1);
      data.value = [...data.value];
      return true;
    } else if (nodes[i].children) {
      const deleted = deleteNode(nodeId, nodes[i].children!);
      if (deleted) return true;
    }
  }
  return false;
};
// Enable editing mode for a node
const enableEditing = (nodeData: TreeNode, node?: any) => {
  nodeEditingStatus.value[nodeData.id!] = true;
  nodeEditingValues.value[nodeData.id!] = nodeData.label;
};

// Save the label to the actual tree data and exit editing mode
const saveLabel = (nodeData: TreeNode, node?: any) => {
  const updatedNode = findNode(data.value, nodeData.id);
  if (updatedNode) {
    updatedNode.label = nodeEditingValues.value[nodeData.id!];
    ElMessage.success('修改成功');
    // Trigger reactivity by ‘replacing the array’
    data.value = [...data.value];
  }
  nodeEditingStatus.value[nodeData.id!] = false;
};
// Cancel editing without saving
const cancelEditing = (nodeData: TreeNode, node?: any) => {
  nodeEditingStatus.value[nodeData.id!] = false;
};
// Find a node by ID
const findNode = (nodes: TreeNode[], nodeId: number | undefined): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNode(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
};

// Get clicked node info
const getClickedNodeInfo = (node: TreeNode) => {
  // console.log('点击的节点:', node);
};

// function cancelEditingAll(e: any) {
//   e.stopPropagation();
//   const className = e.target.className;
//   // console.log(e.target.className);
//   // Check if the click is outside the tree container
//   if (
//     treeContainerRef.value &&
//     !treeContainerRef.value.contains(e.target as Node)
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
</script>
<style lang="scss" scoped>
.tree-container {
  position: relative;
  .filter-tree {
    @include filter-tree;
    .tree-node {
      @include flexbox;

      .label {
        margin-right: 10px;
        cursor: pointer;
      }
      .label-editing {
        @include animate-glowing-border;
        padding: 0;
      }

      .operations {
        background-color: $bg_color;
      }
    }
  }
  .context-menu {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 5px;
    width: 120px;
    z-index: 1000;
    .ul {
      list-style: none;
      padding: 0;
      margin: 0;
      .li {
        padding: 8px;
        cursor: pointer;
        &:hover {
          background-color: #f0f0f0;
        }
      }
    }
  }
}

.test {
  background: black;
  color: red;
}
</style>
