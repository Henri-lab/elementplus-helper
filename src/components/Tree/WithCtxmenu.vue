<template>
  <ContextMenu
    :targetElement="targetElement"
    :menuItems="menuOptions"
    :context="context"
  ></ContextMenu>
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
    >
      <template #default="{ node }">
        <span class="tree-node">
          <div class="checkbox">
            <el-checkbox
              v-model="node.data.check"
              :checked="node.data.check"
            ></el-checkbox>
          </div>
          <span class="label">
            {{ node.label }}
          </span>
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
  <div class="test" v-draggable v-if="props.test">
    {{ data }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { ElTree } from 'element-plus';

//@ts-ignore
import { executeUntilNonEmpty, sleep } from '@/utils/tool';
//@ts-ignore
import ContextMenu from '../ContextMenu/index.vue';
//@ts-ignore
import connection from '@/assets/image/connection.png';
//@ts-ignore
import addone from '@/assets/image/add-one.png';
//@ts-ignore
import Delete from '@/assets/image/delete.png';
import { useAttrs } from 'vue';

const attrs = useAttrs();

interface Tree {
  [key: string]: any;
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
  contextAreaId: {
    type: String,
    default: 'idOfTree',
  },
  data: {
    type: Array<any>,
    default: () => [
      {
        label: 'Node 1',
        children: [
          {
            label: 'Node 1-1',
            children: [
              {
                label: 'Node 1-1-1',
              },
              {
                label: 'Node 1-1-2',
              },
            ],
          },
          {
            label: 'Node 1-2',
          },
          {
            label: 'Node 1-3',
          },
        ],
      },
      {
        label: 'Node 2',
        children: [
          {
            label: 'Node 2-1',
            children: [
              {
                label: 'Node 2-1-1',
              },
              {
                label: 'Node 2-1-2',
              },
            ],
          },
          {
            label: 'Node 2-2',
          },
          {
            label: 'Node 2-3',
          },
        ],
      },
      {
        label: 'Node 3',
        children: [
          {
            label: 'Node 3-1',
            children: [
              {
                label: 'Node 3-1-1',
              },
              {
                label: 'Node 3-1-2',
              },
            ],
          },
          {
            label: 'Node 3-2',
          },
          {
            label: 'Node 3-3',
          },
        ],
      },
    ],
  },
  menuItems: {
    type: Array,
    default: [
      {
        label: '添加',
        action: () => {
          console.log('添加');
        },
      },
      {
        label: '删除',
        action: () => {
          console.log('删除');
        },
      },
    ],
  },
});

const targetElement = ref(null);
const filterText = ref('tree');
const treeRef = ref<InstanceType<typeof ElTree>>();
const thisTree = treeRef;
async function setContextMenuAeraById(id: string) {
  targetElement.value = document.getElementById(id) as any;
}
watch(
  () => props.contextAreaId, //先于mounted执行
  (newId) => {
    setContextMenuAeraById(newId || 'idOfTree');
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  setContextMenuAeraById(props.contextAreaId || 'idOfTree');
});

const defaultProps = {
  children: 'children',
  label: 'label',
};

const menuOptions = ref(props.menuItems);
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

const data = ref<Tree[]>(props.data);

const clickedNodeLabel = ref('');
const isClickedNodeLeaf = ref(false);
const context = ref<any>({});
const getClickedNodeInfo = (node: Tree) => {
  clickedNodeLabel.value = node.label;
  isClickedNodeLeaf.value = !node.children || node.children.length == 0;
  // console.log('点击的节点label:', clickedNodeLabel.value);
  // console.log('是否是子节点:', isClickedNodeLeaf.value);
  // console.log('点击的节点:', node);
  context.value.curNode = node;
};

const getClickedNodeInfo2 = (node: Tree) => {
  // console.log('点击的节点:', node);
  context.value.curNode = node;
};

// 递归查找节点
const findNode = (data: any, nodeId: any): any => {
  for (let node of data) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const handleAddOne = (node: any) => {
  if (node.isLeaf) {
    //click the node leaf
    console.log('add:node-isLeaf');
  } else {
    console.log('add"node-isParent");');
  }
};

// 添加子节点
const addNode = (parentNodeId: any, newNode: any) => {
  const parentNode = findNode(data, parentNodeId);
  if (parentNode) {
    parentNode.children = parentNode.children || [];
    parentNode.children.push(newNode);
  } else {
    console.warn('Parent node not found');
  }
};

// 删除节点
const deleteNode = (nodeId: any, data: any) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === nodeId) {
      data.splice(i, 1);
      return true;
    } else if (data[i].children) {
      const deleted = deleteNode(nodeId, data[i].children);
      if (deleted) return true;
    }
  }
  return false;
};

// 更新节点
const updateNode = (nodeId: any, updatedProperties: any) => {
  const node = findNode(data, nodeId);
  if (node) {
    Object.assign(node, updatedProperties);
  } else {
    console.warn('Node not found');
  }
};

// 查找节点
const searchNode = (nodeId: any) => {
  return findNode(data, nodeId);
};
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

.test {
  position: fixed;
  top: 0px;
  right: 0px;
  background: wheat;
  color: black;
  width: 800px;
  height: 600px;
  z-index: 1000;
  overflow: scroll;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  @include multicolor-glowing-border;
}
</style>
