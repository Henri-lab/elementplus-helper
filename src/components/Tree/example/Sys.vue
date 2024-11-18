<template>
  <div id="sysTree" ref="sysTree">
    <MyTree
      :data="treeData"
      :test="isTest"
      ref="sysTree"
      dialog
      formName="sysTreeAddForm"
      formType="<tree>"
      @beforeAddNewNode="handleBeforeAddNode"
    ></MyTree>
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
import MyTree from '../index.vue';
//@ts-ignore
import treeMockData from '@/mock/tree_node';
import {
  description_addNewSysForm,
  open,
  //@ts-ignore
} from '@/components/Dialog/forms/config';

const isTest = ref(false);

const isShowTestBtn = ref(false);

const sysTree = ref(null);
const thisTree = sysTree;
const props = defineProps({
  treeData: {
    type: Array<any>,
    default: null,
  },
});

const treeData = ref(props.treeData || treeMockData());

const handleBeforeAddNode = (nodeData: any) => {
  const { nodesRef, node } = nodeData;
  console.log(
    'handleBeforeAddNode\n',
    'selectNode:',
    node,
    'treeData:\n',
    nodesRef.value
  );
  open(description_addNewSysForm, 'sysTree');
};

//@ts-ignore
$bus.on('Test:showTestButton', (isShow: boolean) => {
  isShowTestBtn.value = isShow;
});
</script>

<style lang="scss" scoped>
#sysTree {
  height: $h_aside*0.91;// need design better
  // background-color: red;
}
</style>
