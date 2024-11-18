<!-- 使用单独的Tree -->
<template>
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
            <el-checkbox v-model="node.data.check" :checked="node.data.check" />
          </div>
          <span class="label">{{ node.label }}</span>
          <div class="operations image">
            <el-image :src="connection" style="height: 16px" fit="cover" />
            <el-image
              :src="addone"
              style="height: 16px; margin: 0 5px"
              fit="none"
              @click="handleAddOne(node)"
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
    <ul>
      <li @click="handleMenuAction('add')">添加子节点</li>
      <li @click="handleMenuAction('delete')">删除节点</li>
      <li @click="handleMenuAction('edit')">编辑节点</li>
    </ul>
  </div>

  <div class="btn"><button @click="test = !test">treeData(@dev)</button></div>
  <div class="test" v-show="test" v-draggable>
    {{ data }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { ElTree } from 'element-plus';
//@ts-ignore
import connection from '@/assets/image/connection.png';
//@ts-ignore
import addone from '@/assets/image/add-one.png';
//@ts-ignore
import Delete from '@/assets/image/delete.png';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import { useAttrs } from 'vue';

import { def_treeData } from '../default';

const attrs = useAttrs();

$bus.on('Dialog->Tree:addNode', (formData: any) => {
  addNode(selectedNode.value!.id, {
    id: Date.now(),
    label: formData.label,
  });
});

$bus.on('Dialog->Tree:updateNode', (formData: any) => {
  updateNode(selectedNode.value!.id, {
    id: Date.now(),
    label: formData.label,
  });
});

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
    default: false,
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
const selectedNode = ref<Tree | null>(null); // 保存当前右键点击的节点
const defaultProps = { children: 'children', label: 'label' };

// 数据是响应式的
const data = ref<Tree[]>(props.data);

// 监听输入框过滤关键字
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = ((value: string, data: Tree): boolean => {
  if (!value) return true;
  return data.label.includes(value);
}) as any;

const handleAddOne = (node: any) => {
  console.log('addone');
};

// 处理右键菜单的显示
const handleContextMenu = (event: MouseEvent, node: Tree) => {
  event.preventDefault(); // 阻止默认右键菜单
  selectedNode.value = node; // 保存当前右键点击的节点
  menuPosition.value = { x: event.clientX, y: event.clientY }; // 设置菜单位置
  contextMenuVisible.value = true;

  // 在点击页面其他位置时关闭右键菜单
  const closeContextMenu = () => {
    contextMenuVisible.value = false;
    document.removeEventListener('click', closeContextMenu);
  };
  document.addEventListener('click', closeContextMenu);
};

// 处理右键菜单项的操作
const handleMenuAction = (action: string) => {
  if (selectedNode.value) {
    if (action === 'add') {
      $bus.emit('$:Dialog:addSysToTree:open');
    } else if (action === 'delete') {
      deleteNode(selectedNode.value.id, data.value);
    } else if (action === 'edit') {
      $bus.emit('$:Dialog:addSysToTree:open');
    }
    contextMenuVisible.value = false; // 操作完成后隐藏菜单
  }
};

// 添加子节点
const addNode = (parentNodeId: number | undefined, newNode: Tree) => {
  const parentNode = findNode(data.value, parentNodeId);
  if (parentNode) {
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode);
  } else {
    console.warn('Parent node not found');
  }
};

// 删除节点
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

// 更新节点
const updateNode = (
  nodeId: number | undefined,
  updatedProperties: Partial<Tree>
) => {
  const node = findNode(data.value, nodeId);
  if (node) {
    Object.assign(node, updatedProperties);
  } else {
    console.warn('Node not found');
  }
};

// 查找节点
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

const getClickedNodeInfo = (node: Tree) => {
  console.log('点击的节点:', node);
};

const test = ref(props.test);
</script>

<style lang="scss" scoped>
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
}
.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.context-menu li {
  padding: 8px;
  cursor: pointer;
}
.context-menu li:hover {
  background-color: #f0f0f0;
}
.test {
  position: absolute;
  top: 500px;
  right: 200px;
  width: 400px;
  height: 400px;
  overflow: scroll;
  background: wheat;
  color: black;
  @include glowing-border;
  border-radius: 10%;
}
</style>
