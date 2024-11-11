<template>
  <ContextMenu
    :targetElement="targetElement"
    :menuItems="menuOptions"
  ></ContextMenu>
  <div id="singleTargetTree" ref="singleTargetTree">
    <Tree :data="mockData" :test="isTest"></Tree>
    <button v-if="isShowTestBtn" @click="isTest = !isTest">
      {{ isTest ? 'singleTargetTree:关闭数据' : 'singleTargetTree:显示数据' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import Tree from './index.vue';
//@ts-ignore
import mockData from '@/mock/tree_node';

const isTest = ref(false);
const isShowTestBtn = ref(false);

const targetElement = ref(null);
const singleTargetTree = ref(null);
const thisTree = singleTargetTree;
const menuOptions = [
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
];
onMounted(() => {
  if (thisTree.value) {
    targetElement.value = document.getElementById('singleTargetTree') as any;
  }
});
//@ts-ignore
$bus.on('Test:showTestButton', (isShow: boolean) => {
  isShowTestBtn.value = isShow;
});
</script>

<style lang="scss" scoped></style>
