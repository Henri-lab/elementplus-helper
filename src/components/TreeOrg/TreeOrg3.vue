<template>
  <div class="tree-wrap" style="height: 400px">
    <div class="search-box">
      <el-select v-model="keyword" @click="filter" placeholder="model-test">
        <el-option
          v-for="item in models"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <vue3-tree-org
      ref="tree"
      :data="data"
      :horizontal="horizontal"
      :collapsable="collapsable"
      :label-style="style"
      :node-draggable="true"
      :scalable="false"
      :only-one-node="onlyOneNode"
      :default-expand-level="1"
      :filter-node-method="filterNodeMethod"
      :clone-node-drag="cloneNodeDrag"
      @on-restore="restore"
      @on-contextmenu="onMenus"
      @on-node-click="onNodeClick"
    >
      <!-- 自定义节点内容 -->
      <template v-slot="{ node }">
        <div class="tree-org-node__text node-label">
          <div class="custom-content">自定义内容</div>
          <div>节点名称：{{ node.label }}</div>
        </div>
      </template>
      <!-- 自定义展开按钮 -->
      <template v-slot:expand="{ node }">
        <div>{{ node.children.length }}</div>
      </template>
    </vue3-tree-org>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const data = reactive({
  id: 1,
  label: 'Machine Learning Models', // Root node
  children: [
    {
      id: 2,
      pid: 1,
      label: 'Supervised Learning', // First category of models
      style: { color: '#fff', background: '#108ffe' },
      children: [
        { id: 6, pid: 2, label: 'Linear Regression', disabled: true },
        { id: 8, pid: 2, label: 'Decision Trees', noDragging: true },
        { id: 10, pid: 2, label: 'Support Vector Machine (SVM)' },
      ],
    },
    {
      id: 3,
      pid: 1,
      label: 'Unsupervised Learning', // Second category of models
      children: [
        { id: 11, pid: 3, label: 'K-Means Clustering' },
        { id: 12, pid: 3, label: 'Principal Component Analysis (PCA)' },
      ],
    },
    {
      id: 4,
      pid: 1,
      label: 'Reinforcement Learning', // Third category of models
      children: [
        { id: 13, pid: 4, label: 'Q-Learning' },
        { id: 14, pid: 4, label: 'Deep Q-Network (DQN)' },
        { id: 15, pid: 4, label: 'Proximal Policy Optimization (PPO)' },
      ],
    },
  ],
});
const keyword = ref('');
const horizontal = ref(false);
const collapsable = ref(true);
const onlyOneNode = ref(true);
const cloneNodeDrag = ref(true);
const expandAll = ref(true);
const style = reactive({
  background: 'black',
  color: '#fff',
});

const models = [
  { value: 'tree', label: 'Tree' },
  { value: 'org', label: 'Org' },
  { value: 'org-chart', label: 'Org Chart' },
  { value: 'nested', label: 'Nested' },
];

const onMenus = ({ node, command }) => {
  console.log(node, command);
};

const restore = () => {
  console.log('restore');
};

const filter = () => {
  treeRef.value.filter(keyword.value);
};

const filterNodeMethod = (value, nodeData) => {
  console.log(value, nodeData);
  if (!value) return true;
  return nodeData.label.includes(value);
};

const onNodeClick = (event, nodeData) => {
  console.log(`Clicked node: ${nodeData.label}`);
};

const toggleExpand = () => {
  expandAll.value = !expandAll.value;
  traverseNodes(data, expandAll.value);
};

// 遍历节点的函数，用于控制展开或折叠所有节点
const traverseNodes = (node, shouldExpand) => {
  node.expanded = shouldExpand;
  if (node.children && node.children.length) {
    node.children.forEach((child) => traverseNodes(child, shouldExpand));
  }
};

// Tree 组件的引用
const treeRef = ref(null);
</script>

<style lang="scss" scoped>
.tree-wrap {
  position: relative;
  padding: 0;
  ::v-deep(.zoom-container) {
    background-color: $bg_color !important;
  }
  ::v-deep(.zm-tree-org) {
    padding: 0;
  }
}

.search-box {
  padding: 8px 15px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;

  input {
    width: 200px;
    height: 32px;
    border: 1px solid #ddd;
    outline: none;
    border-radius: 5px;
    padding-left: 10px;
  }
}

.tree-org-node__text {
  text-align: left;
  font-size: 14px;

  .custom-content {
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid currentColor;
  }
}
</style>
