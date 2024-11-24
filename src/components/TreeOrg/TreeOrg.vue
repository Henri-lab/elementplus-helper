<template>
  <div class="tree-wrap" @click="hideContextMenu">
    <!-- 拖拽源区域 -->
    <div class="drag-box">
      <h3>可拖拽项目</h3>
      <draggable
        v-model="draggableItems"
        group="forms"
        item-key="id"
        @start="onDragStart"
        :clone="cloneItem"
      >
        <div
          class="draggable-item"
          v-for="element in draggableItems"
          :key="element.id"
        >
          {{ element.label }}
        </div>
      </draggable>
    </div>

    <!-- 树形组件 -->
    <div class="tree-area">
      <vue3-tree-org
        ref="tree"
        :data="data"
        expand="expand"
        :horizontal="horizontal"
        :collapsable="collapsable"
        :label-style="style"
        :node-draggable="true"
        :scalable="false"
        :only-one-node="onlyOneNode"
        :default-expand-level="1"
        @drop="onDropNode"
        @dragover.prevent
        :define-menus="defineMenus"
        @on-contextmenu="onMenus"
        @on-node-click="onNodeClick"
      >
        <template #default="{ node }">
          <div class="tree-org-node__custom" :data-id="node.id">
            <div>{{ node.$$data.label}}</div>
            
            <el-form v-model="node.$$data.formData" v-if="node.$$data.type==0">
              <el-form-item
                v-for="(prop, index) in getKeys(node.$$data.formData)"
                :key="index"
                :prop="prop"
                :label="prop"
              >
                <el-input v-model="node.$$data.formData[prop]"></el-input>
              </el-form-item>
            </el-form>
            <el-button size="small" @click="showForm(node)">编辑表单</el-button>
          </div>
        </template>
      </vue3-tree-org>
    </div>
    <!-- 表单区域 -->
    <div v-if="selectedFormNode" class="form-area">
      {{ data }}
      <!-- <h3>{{ selectedFormNode.label }} 的表单</h3>
      <el-form :model="selectedFormNode.formData" label-width="120px">
        <el-form-item
          v-for="(value, key) in selectedFormNode.formData"
          :key="key"
          :label="key"
        >
          <el-input v-model="selectedFormNode.formData[key]" />
        </el-form-item>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </el-form> -->
    </div>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive } from 'vue';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

// 树形数据
const data = reactive({
  id: 1,
  label: 'xx1', // 根节点
  type: 'root',
  expand: true,
  formData: {}, // 根节点的表单数据
  children: [
    {
      id: 2,
      pid: 1,
      label: 'xx2',
      expand: true,
      type: 'category',
      formData: {},
      children: [
        {
          id: 4,
          pid: 2,
          label: 'xx4',
          type: 'category',
          formData: {},
          children: [],
        },
        {
          id: 5,
          pid: 2,
          label: 'xx5',
          type: 'category',
          formData: {},
          children: [],
        },
      ],
    },
    {
      id: 3,
      pid: 1,
      label: 'xx3',
      expand: true,
      type: 'category',
      formData: {},
      children: [],
    },
  ],
});
const getKeys = (object) => {
  if (!object) return [];
  let keys = Object.keys(object);
  return keys;
};

// 可拖拽项目列表
const draggableItems = ref([
  {type:0, id: 100, label: '表单A', formData: { field1: '', field2: '' } },
  {type:1,  id: 200, label: '表单B', formData: { name: '', age: '' } },
  {type:2,  id: 300, label: '表单C', formData: { type: '', value: '' } },
]);

// 当前拖拽的项目
const currentDraggedItem = ref(null);
// 当前选中的表单节点
const selectedFormNode = ref(null);

// 配置项
const horizontal = ref(false);
const collapsable = ref(true);
const onlyOneNode = ref(true);
const style = reactive({
  background: '#f9f9f9',
  color: '#333',
});

// 拖拽开始
const onDragStart = (evt, v) => {
  // console.log(evt.item._underlying_vm_,'onDragStart')
  currentDraggedItem.value = evt.item._underlying_vm_; // 记录当前拖拽的项目
};

// 克隆拖拽项
const cloneItem = (item) => {
  // console.log(item,'cloneItem')
  return { ...item }; // 深拷贝拖拽项，防止源数据被修改
};

const onNodeClick = (evt, node) => {
  // console.log('onNodeClick',node)
  selectedNode.value = node;
};
// 拖拽放置到节点
const onDropNode = (event, node = {}) => {
  // console.log(event, node,currentDraggedItem.value, "onDropNode")
  const draggedItem = currentDraggedItem.value;
  if (!draggedItem) return;
  console.log(event.target.closest('.tree-org-node__custom'));
  const targetNodeId = event.target.closest('.tree-org-node__custom')?.dataset
    ?.id;
  if (!targetNodeId) return;
  const targetNode = findNodeById(data, targetNodeId);
  targetNode.children = targetNode.children || [];
  //   console.log(targetNode, 'targetNode');
  draggedItem.pid = targetNodeId;
  draggedItem.isLeaf = true;
  targetNode.isLeaf = false;
  targetNode.children.push(draggedItem);
  // 合并拖拽表单的默认数据到节点的表单
  Object.assign(targetNode.formData, draggedItem.formData);
  //   console.log(event.target.closest('.tree-org-node__custom')?.dataset?.id, 'add to that node');
  //   console.log(`表单 "${draggedItem.label}" 已放置到节点 "${node.label}"`);
};

// 显示表单
const showForm = (node) => {
  selectedFormNode.value = node;
};

// 保存表单
const saveForm = () => {
  console.log('保存表单数据：', selectedFormNode.value.formData);
};

const defineMenus = (e, node) => {
  if (node.disabled) {
    return [
      { name: '复制', command: 'copy' },
      { name: '禁止', command: 'my_forbid' },
    ];
  } else {
    return [
      { name: '复制', command: 'copy' },
      //   { name: '新建', command: 'add' },
      { name: '编辑', command: 'my_edit' },
      { name: '删除', command: 'my_delete' },
    ];
  }
};
const onMenus = ({ command, node, data }) => {
  selectedNode.value = node; // 记录当前右键的节点
  // console.log(arg)
  if (command == 'my_delete') {
    deleteNode();
  }
};
const selectedNode = ref(null); // 当前右键选中的节点

// 编辑节点
const editNode = () => {
  alert(`编辑节点：${selectedNode.value.label}`);
  hideContextMenu();
};

//查找节点
const findNodeById = (tree, id) => {
  if (tree.id === Number(id)) return tree;
  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const result = findNodeById(child, id);
      if (result) return result;
    }
  }
  return null;
};

// 添加子节点
const addChildNode = () => {
  const newNode = {
    id: Date.now(),
    label: 'New Child Node',
    children: [],
  };
  selectedNode.value.children.push(newNode);
  ElMessage.success(`已添加子节点到：${selectedNode.value.label}`);
  hideContextMenu();
};

// 删除节点
const deleteNode = () => {
  const findAndDeleteNode = (tree, nodeId) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === nodeId) {
        tree.splice(i, 1);
        return true;
      }
      if (tree[i].children) {
        const found = findAndDeleteNode(tree[i].children, nodeId);
        if (found) return true;
      }
    }
    return false;
  };

  ElMessageBox(`您是否确认删除节点：${selectedNode.value.label}`).then(() => {
    findAndDeleteNode(data.children, selectedNode.value.id)
      ? ElMessage.success(`已删除节点：${selectedNode.value.label}`)
      : ElMessage.error('删除失败');
    console.log(data);
  });
};
</script>
<style lang="scss" scoped>
.tree-wrap {
  display: flex;
  height: 100%;
  position: relative;
}

.drag-box {
  width: 25%;
  padding: 10px;
  border-right: 1px solid #ccc;
  background-color: #f8f8f8;
  //   position: absolute;
  //   top:-300px;

  .draggable-item {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    background-color: white;
    cursor: grab;
  }
}

.tree-area {
  flex: 1;
  padding: 20px;
}

.form-area {
  width: 30%;
  padding: 10px;
  border-left: 1px solid #ccc;
  background-color: #f8f8f8;
}
</style>
