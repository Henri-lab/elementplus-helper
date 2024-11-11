<template>
  <div class="test">
    <Tree :data="mockData" :test="isTest"></Tree>
    <button v-if="isShowTestBtn" @click="isTest = !isTest">
      {{ isTest ? 'test-关闭数据' : 'test-显示数据' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import Tree from './index.vue';
//@ts-ignore
import mockData from '@/mock/tree_node';

const isTest = ref(false);
const isShowTestBtn = ref(false);

//@ts-ignore
$bus.on('Test:showTestButton', (isShow: boolean) => {
  isShowTestBtn.value = isShow;
});
</script>

<style lang="scss" scoped></style>
