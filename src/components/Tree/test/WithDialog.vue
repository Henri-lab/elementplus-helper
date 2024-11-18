<template>
  <div id="sysTree" ref="sysTree">
    <BasicTree
      id="idOfSysTree"
      :data="treeData"
      :test="isTest"
      ref="sysTree"
      dialog
      formName="sysTreeAddForm"
    ></BasicTree>
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
import BasicTree from '../index.vue';
//@ts-ignore
import treeMockData from '@/mock/tree_node';

const isTest = ref(false);

const isShowTestBtn = ref(false);

const targetElement = ref(null);
const sysTree = ref(null);
const thisTree = sysTree;
const props = defineProps({
  treeData: {
    type: Array<any>,
    default: null,
  },
});

const treeData = ref(props.treeData || treeMockData());
onMounted(() => {
  if (thisTree.value) {
    targetElement.value = document.getElementById('sysTree') as any;
  }
});

//@ts-ignore
$bus.on('Test:showTestButton', (isShow: boolean) => {
  isShowTestBtn.value = isShow;
});
</script>

<style lang="scss" scoped></style>
