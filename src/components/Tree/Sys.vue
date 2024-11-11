<template>
  <DialogAddSysToTree />
  <ContextMenu
    :targetElement="targetElement"
    :menuItems="menuOptions"
  ></ContextMenu>
  <div id="sysTree" ref="sysTree">
    <Tree id="idOfSysTree" :data="mockData" :test="isTest" ref="sysTree"></Tree>
    <button v-if="isShowTestBtn" @click="isTest = !isTest">
      {{ isTest ? 'sysTree:关闭数据' : 'sysTree:显示数据' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import Tree from './index.vue';
import DialogAddSysToTree from '../EditDialog/addSysToTree.vue';
//@ts-ignore
import mockData from '@/mock/tree_node';

const isTest = ref(false);

const isShowTestBtn = ref(false);

const targetElement = ref(null);
const sysTree = ref(null);
const thisTree = sysTree;
const menuOptions = [
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
];

onMounted(() => {
  if (thisTree.value) {
    console.log('sysTree:onMounted', document.getElementById('sysTree'));
    targetElement.value = document.getElementById('sysTree') as any;
  }
});

//@ts-ignore
$bus.on('Test:showTestButton', (isShow: boolean) => {
  isShowTestBtn.value = isShow;
});
</script>

<style lang="scss" scoped></style>
