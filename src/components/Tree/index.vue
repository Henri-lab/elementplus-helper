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
        node-key="id"
        :default-expand-all="false"
        :filter-node-method="filterNode"
        @node-click="getClickedNodeInfo"
        @node-contextmenu="handleContextMenu"
      >
        <!-- data here is called node，node here is called nodeInfo-->
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
              {{ test ? `(${data.id})-🌟-${data.label} ` : data.label }}
            </span>
            <el-input
              v-else
              v-model="nodeEditingValues[data.id]"
              class="label-editing"
              @dblclick="cancelEditing(data, node)"
              @keyup.enter="handleSaveLabel(data, node)"
              @keyup.esc="cancelEditing(data, node)"
            />
            <div class="operations image">
              <el-image :src="connection" style="height: 16px" fit="cover" />
              <el-image
                :src="addone"
                style="height: 16px; margin: 0 5px"
                fit="none"
                @click="handleAddNode('fromImage', data, node)"
              />
              <el-image
                :src="Delete"
                style="height: 16px"
                fit="cover"
                @click="handleDeleteNode('fromImage', data, node)"
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
        <li class="li" @click="handleMenuAction('redo')">撤销更改</li>
      </ul>
    </div>
    <div class="test-wrapper">
      <div class="test" v-show="props.test" v-draggable v-resizable>
        <el-divider>treeData</el-divider>
        <br />
        <!-- {{ format_data }} -->
        {{ data }}
        <br />
        <el-divider>historyStack</el-divider>
        <br />
        {{ historyStack }}
        <br />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import { ElTree, ElInput, ElMessage } from 'element-plus';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import connection from '@/assets/image/connection.png';
//@ts-ignore
import addone from '@/assets/image/add-one.png';
//@ts-ignore
import Delete from '@/assets/image/delete.png';
import { def_treeData } from './default';
//@ts-ignore
import mockData from '@/mock/tree_node';
import type {
  //@ts-ignore
  ITreeNode,
  //@ts-ignore
  IOperationParams,
  //@ts-ignore
  IHistoryStackItem,
} from './interface';
//@ts-ignore
import { addNodeWithHistory, addNode } from './tool/add';
//@ts-ignore
import { deleteNodeWithHistory, deleteNode } from './tool/del';
//@ts-ignore
import { updateNode, saveLabel, undoAction } from './tool/update';
import { findNode } from './tool/find';
//@ts-ignore
import { getKeysByValue } from '@/utils/tool';

//convery property 'id' of vdom
import { useAttrs } from 'vue';
const attrs = useAttrs();

type TreeNode = ITreeNode;
type HistoryStackItem = IHistoryStackItem;
$bus.on('Dialog->Tree:addNode', (arg: any) => {
  console.log('addNode', arg);
  handleAddNode(null, null, arg.formData);
});

//update and edit is the same in this case
$bus.on('Dialog->Tree:updateNode', (arg: any) => {
  console.log('updateNode', arg);
});

const emits = defineEmits([
  'beforeAddNewNode',
  'afterAddNewNode',
  'beforeUpdateNewNode',
  'afterUpdateNewNode',
]);
const props = defineProps({
  test: {
    type: Boolean,
    default: false,
  },
  idOfTree: {
    type: String,
    default: 'idOfTree',
  },
  data: {
    type: Array as () => TreeNode[],
    default: () => mockData() as TreeNode[],
  },
  ctxmenuActions: {
    type: Object,
    default: {},
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  formType: {
    type: String,
    default: 'default',
  },
  formName: {
    type: String,
    default: 'default',
  },
  newNode: {
    type: Object,
    default: { id: Date.now(), label: '??' },
  },
  uptateSuccessText: {
    type: String,
    default: 'Update successfully',
  },
  updateFailText: {
    type: String,
    default: 'Update failed',
  },
  addSuccessText: {
    type: String,
    default: 'Add successfully',
  },
  nodeDefaultLabel: {
    type: String,
    default: 'New Node',
  },
  deleteSuccessText: {
    type: String,
    default: 'Delete successfully',
  },
  deleteFailText: {
    type: String,
    default: 'Delete failed',
  },
});

//core
const treeContainerRef = ref<HTMLElement | null>(null);
const treeRef = ref<InstanceType<typeof ElTree>>();
const data = ref<TreeNode[]>(props.data);
//state stack of operation
const historyStack = ref<HistoryStackItem[]>([]);
//state other
const filterText = ref('tree-index');
//context
const contextMenuVisible = ref(false);
const contextMenuActions = ref<any>(props.ctxmenuActions);
const menuPosition = ref({ x: 0, y: 0 });
//node operations
const selectedNode = ref<TreeNode | null>(null);
const defaultProps = { children: 'children', label: 'label' };
const newNode = ref<any>(props.newNode);
// Store the editing state of each node by ID
const nodeEditingStatus = ref<Record<number, boolean>>({});
const nodeEditingValues = ref<Record<number, string>>({});
//dialog form
const enableDialog = ref(props.dialog);
const dialogFormType = ref(props.formType);
const dialogFormName = ref(props.formName);
//message after operations
const updateSuccessText = ref(props.uptateSuccessText);
const updateFailText = ref(props.updateFailText);
const addSuccessText = ref(props.addSuccessText);
const nodeDefaultLabel = ref(props.nodeDefaultLabel);
const deleteSuccessText = ref(props.deleteSuccessText);
const deleteFailText = ref(props.deleteFailText);

const handleAddNode = (
  type?: string, //will set parentId select strategy
  parentNode?: ITreeNode,
  //@ts-ignore
  nodeInfo?: any
) => {
  const condition1 = type === 'fromImage' && parentNode;
  const parentNodeId = condition1 ? parentNode.id : selectedNode.value?.id;

  if (parentNodeId) {
    //@ts-ignore
    addNodeWithHistory({
      nodesRef: data,
      parentNodeId: parentNodeId,
      newNode: {
        id: nodeInfo.id || Date.now(),
        label: nodeInfo.label || nodeDefaultLabel.value,
      },
      historyStack,
    });
    // expand the nodes
    treeRef.value.store.getNode(parentNodeId).expanded = true;
    ElMessage.success(addSuccessText.value);
  }
};

const handleDeleteNode = (
  type?: string,
  parentNode?: ITreeNode,
  //@ts-ignore
  nodeInfo?: any
) => {
  const condition1 = type === 'fromImage' && parentNode;
  if (condition1) {
    deleteNodeWithHistory({
      nodesRef: data,
      nodeId: parentNode.id,
      historyStack,
    })
      ? ElMessage.success(deleteSuccessText.value)
      : ElMessage.error(deleteFailText.value);
  } else if (selectedNode.value) {
    deleteNodeWithHistory({
      nodesRef: data,
      nodeId: selectedNode.value.id,
      historyStack,
    })
      ? ElMessage.success(deleteSuccessText.value)
      : ElMessage.error(deleteFailText.value);
  }
};

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
      if (enableDialog.value) {
        emits('beforeAddNewNode', { nodesRef: data, node: selectedNode.value });
        $bus.emit('$:EditDialog:SlotForm:open', {
          formType: dialogFormType.value,
          formName: dialogFormName.value,
          nodesRef: data,
          node: selectedNode.value,
        });
      } else {
        handleAddNode();
      }
    } else if (action === 'delete') {
      handleDeleteNode();
    } else if (action === 'edit') {
      if (enableDialog.value) {
        emits('beforeUpdateNewNode');
      } else {
        enableEditing(selectedNode.value);
      }
    } else if (action === 'redo') {
      undoAction({ nodesRef: data, historyStack });
    }
    contextMenuVisible.value = false;
  }
};

// Enable editing mode for a node
const enableEditing = (node: TreeNode, nodeInfo?: any) => {
  nodeEditingStatus.value[node.id!] = true;
  nodeEditingValues.value[node.id!] = node.label;
};

// Save the label to the actual tree data and exit editing mode
const handleSaveLabel = (node: TreeNode, nodeInfo: any) => {
  const newLabel = nodeEditingValues.value[node.id!];
  const previousLabel = node.label; // cache last value
  nodeEditingStatus.value[node.id!] = false;
  const success = saveLabel({ nodesRef: data, nodeId: node.id, newLabel });

  if (success) {
    historyStack.value.push({
      action: 'update',
      payload: { id: node.id, previousLabel },
    });
    ElMessage.success(props.uptateSuccessText);
  } else {
    ElMessage.error(props.updateFailText);
  }
};
// Cancel editing without saving
const cancelEditing = (node: TreeNode, nodeInfo?: any) => {
  nodeEditingStatus.value[node.id!] = false;
};
// Find a node by which is editing
const findNodeEditing = () => {
  return getKeysByValue(nodeEditingStatus.value, true);
};

// Get clicked node info(for test)
const getClickedNodeInfo = (node: TreeNode) => {
  // console.log('点击的节点:', node);//ok
  // console.log('editing', findNodeEditing());//ok
  // console.log(nodeEditingStatus.value);//ok
  // console.log('editing nodeId arr:', findNodeEditing());//ok
};
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
    z-index: 99999999;
    .ul {
      list-style: none;
      padding: 0;
      margin: 0;
      .li {
        padding-bottom: 8px;
        cursor: pointer;
        &:hover {
          background-color: #1659d5;
        }
      }
    }
  }
}

.test {
  background: black;
  color: red;
  overflow: scroll;
  position: fixed;
  width: 500px;
  height: 500px;
  z-index: 9999999999999999 !important; //16位
  @include multicolor-glowing-border;
  border-radius: 5%;
}
</style>
