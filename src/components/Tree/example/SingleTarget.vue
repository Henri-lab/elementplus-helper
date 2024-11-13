<template>
  <div id="singleTargetTree" ref="singleTargetTree">
    <BasicTree :data="treeData" :test="isTest"></BasicTree>
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
import BasicTree from '../index.vue';
//@ts-ignore
import treeMockData from '@/mock/tree_node';

const isTest = ref(false);
const isShowTestBtn = ref(false);

const targetElement = ref(null);
const singleTargetTree = ref(null);
const thisTree = singleTargetTree;

const props = defineProps({
  treeData: {
    type: Array<any>,
    default: null,
  },
});

const treeData = ref(!!props.treeData || treeMockData('noChildren'));
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
