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
//@ts-ignore
import { def_menuItems } from '../default';
const isTest = ref(false);

const menuItems = def_menuItems;

const props = defineProps({
  treeData: {
    type: Array<any>,
    default: null,
  },
});
const treeData = ref(props.treeData || treeMockData());
</script>

<style lang="scss" scoped></style>
