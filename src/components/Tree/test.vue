<!-- 使用结合ContextMenu的Tree -->
<template>
  <div id="TreeTest_henri" class="test">
    <TreeWithCtxmenu
      :data="treeData"
      :test="isTest"
      :menuItems="menuItems"
      contextAreaId="TreeTest_henri"
    ></TreeWithCtxmenu>
    <el-button @click="isTest = !isTest">{{
      isTest ? '关闭数据' : '显示数据'
    }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
//@ts-ignore
import TreeWithCtxmenu from './WithCtxmenu.vue';
//@ts-ignore
import treeMockData from '@/mock/tree_node';

const isTest = ref(false);

const menuItems = [
  //context-menu accepts 'action' which accepts 'node-infos'
  {
    label: '添加',
    action: ({ curNodeRef }: any) => {
      console.log('添加', curNodeRef.value);
    },
  },
  {
    label: '删除',
    action: () => {
      console.log('删除');
    },
  },
  {
    label: '编辑',
    action: () => {
      console.log('编辑');
    },
  },
  {
    label: '复制',
    action: () => {
      console.log('复制');
    },
  },
  {
    label: '粘贴',
    action: () => {
      console.log('粘贴');
    },
  },
  {
    label: '剪切',
    action: () => {
      console.log('剪切');
    },
  },
  {
    label: '刷新',
    action: () => {
      console.log('刷新');
    },
  },
  {
    label: '保存',
    action: () => {
      console.log('保存');
    },
  },
  {
    label: '取消',
    action: () => {
      console.log('取消');
    },
  },
  {
    label: '帮助',
    action: () => {
      console.log('帮助');
    },
  },
  {
    label: '更多',
    action: () => {
      console.log('更多');
    },
  },
];

const props = defineProps({
  treeData: {
    type: Array<any>,
    default: null,
  },
});
const treeData = ref(props.treeData || treeMockData());
</script>

<style lang="scss" scoped></style>
