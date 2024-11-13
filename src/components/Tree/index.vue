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
        <template #default="{ node }">
          <span class="tree-node">
            <div class="checkbox">
              <el-checkbox
                v-model="node.data.check"
                :checked="node.data.check"
              />
            </div>
            <!-- Conditionally render label or input based on editing state -->
            <span
              v-if="!nodeEditingStatus[node.id]"
              class="label"
              @dblclick="enableEditing(node)"
            >
              {{ node.label }}
            </span>
            <el-input
              v-else
              v-model="nodeEditingValues[node.id]"
              class="label-edit"
              @blur="saveLabel(node)"
              @keyup.enter="saveLabel(node)"
              @keyup.esc="cancelEditing(node)"
            />
            <div class="operations image">
              <el-image :src="connection" style="height: 16px" fit="cover" />
              <el-image
                :src="addone"
                style="height: 16px; margin: 0 5px"
                fit="none"
              />
              <el-image :src="Delete" style="height: 16px" fit="cover" />
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
import { onMounted, ref, watch } from 'vue';
import { ElTree, ElInput } from 'element-plus';
//@ts-ignore
import connection from '@/assets/image/connection.png';
//@ts-ignore
import addone from '@/assets/image/add-one.png';
//@ts-ignore
import Delete from '@/assets/image/delete.png';
//@ts-ignore
import $bus from '@/utils/bus';
import { def_treeData } from './default';
import { useAttrs } from 'vue';
//@ts-ignore
// import { JsonFormat } from '@/utils/format';

const attrs = useAttrs();

interface Tree {
  id?: number;
  label: string;
  children?: Tree[];
  check?: boolean;
}

const props = defineProps({
  idOfTree: {
    type: String,
    default: 'idOfTree',
  },
  test: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array as () => Tree[],
    default: () => def_treeData,
  },
});

const filterText = ref('tree-index');
const treeRef = ref<InstanceType<typeof ElTree>>();
const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedNode = ref<Tree | null>(null);
const defaultProps = { children: 'children', label: 'label' };
const data = ref<Tree[]>(props.data);
const treeContainerRef = ref<HTMLElement | null>(null); // Reference to the container

// Store the editing state of each node by ID
const nodeEditingStatus = ref<Record<number, boolean>>({});
const nodeEditingValues = ref<Record<number, string>>({});
// Watch filter text input and filter nodes accordingly
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = ((value: string, data: Tree): boolean => {
  if (!value) return true;
  return data.label.includes(value);
}) as any;

// Enable editing mode for a node
const enableEditing = (node: Tree) => {
  nodeEditingStatus.value[node.id!] = true;
  nodeEditingValues.value[node.id!] = node.label; // Load current label into editable value
};

// Save the label and exit editing mode
const saveLabel = (node: Tree) => {
  // node.label = nodeEditingValues.value[node.id!];//bug
  // it’s generally better to update the data object by replacing the entire node in the array,
  // as Vue’s reactivity system may not always track individual properties correctly when working with nested objects in a reactive array.
  const updatedNode = findNode(data.value, node.id);
  console.log('updated node', updatedNode, node.id);

  if (updatedNode) {
    updatedNode.label = nodeEditingValues.value[node.id!];

    data.value = [...data.value]; // sloution：trigger reactivity by replacing the entire data array
  }
  nodeEditingStatus.value[node.id!] = false;
};

// Cancel editing without saving
const cancelEditing = (node: Tree) => {
  nodeEditingStatus.value[node.id!] = false;
};

// Handle right-click menu and position it within the component container
const handleContextMenu = (event: MouseEvent, node: Tree) => {
  event.preventDefault(); // Prevent the default context menu
  selectedNode.value = node; // Store the current right-clicked node

  if (treeContainerRef.value) {
    const containerRect = treeContainerRef.value.getBoundingClientRect();
    const relativeX = event.clientX - containerRect.left;
    const relativeY = event.clientY - containerRect.top;

    menuPosition.value = { x: relativeX, y: relativeY }; // Set the position relative to the container
    contextMenuVisible.value = true;

    // Close the menu when clicking elsewhere
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
      enableEditing(selectedNode.value); // Enable editing mode
    }
    contextMenuVisible.value = false; // Hide the menu after an action
  }
};

// Add a child node
const addNode = (parentNodeId: number | undefined, newNode: Tree) => {
  const parentNode = findNode(data.value, parentNodeId);
  if (parentNode) {
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode);
  } else {
    console.warn('Parent node not found');
  }
};

// Delete a node
const deleteNode = (nodeId: number | undefined, nodes: Tree[]) => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      nodes.splice(i, 1);
      return true;
    } else if (nodes[i].children) {
      const deleted = deleteNode(nodeId, nodes[i].children!);
      if (deleted) return true;
    }
  }
  return false;
};

// Find a node by ID
const findNode = (nodes: Tree[], nodeId: number | undefined): Tree | null => {
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
const getClickedNodeInfo = (node: Tree) => {
  console.log('点击的节点:', node);
};

//================================================================
//@root权限使用
// const format_data = ref<any>('');
// watch(
//   () => data,
//   async (data) => {
//     format_data.value = (await JsonFormat(data)) || data || 'fail loading bind-data';
//   },
//   { immediate: true, deep: true }
// );
//================================================================
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

.test{
  background: black;
  color: red;
}
</style>
