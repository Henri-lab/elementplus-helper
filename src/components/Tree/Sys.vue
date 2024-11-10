<template>
  <div class="test">
    <Tree :data="mockData" :test="isTest"></Tree>
    <el-button @click="isTest = !isTest">{{
      isTest ? '关闭数据' : '显示数据'
    }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
//@ts-ignore
import Tree from './index.vue';
//@ts-ignore
import mockData from '@/mock/tree_node';

const isTest = ref(false);
</script>

<style lang="scss" scoped></style>
