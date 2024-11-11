<template>
  <div class="test">
    <Tabs :tabs="tabs" :isGuard="false" :helpInfo="helpInfo()"></Tabs>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import Tabs from './index.vue';
//@ts-ignore
import Tree1 from '@/components/Tree/example/Sys.vue';
//@ts-ignore
import Tree2 from '@/components/Tree/example/SingleTarget.vue';
import { markRaw } from 'vue';

const tabs = [
  {
    label: '目标体系',
    name: 'first',
    component: markRaw(Tree1),
    icon: 'el-icon-?',
    content: 'content',
  },
  {
    label: '单目标',
    name: 'second',
    component: markRaw(Tree2),
    icon: 'el-icon-?',
    content: 'content',
  },
];

const helpInfo = () => {
  if (0) {
    return {
      enabled: true,
      createInfo: (name: string) => {
        return `切换至${name}失败`;
      },
      type: 'error',
    };
  } else if (1) {
    return {
      enabled: true,
      createInfo: (name: string) => {
        return `切换至${name}成功`;
      },
      type: 'success',
    };
  } else {
    return {
      enabled: true,
      createInfo: (name: string) => {
        return `切换至${name}成功`;
      },
      type: 'info',
    };
  }
};
</script>

<style lang="scss" scoped>
.test {
  background: rgba(0, 0, 0, 0.429);
  height: 100%;
}
</style>
