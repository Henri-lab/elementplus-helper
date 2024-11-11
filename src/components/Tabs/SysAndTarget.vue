<template>
  <div class="tabs-sys-and-singleTarget">
    <Tabs :tabs="tabs" :isGuard="false" :helpInfo="helpInfo()"></Tabs>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import Tabs from './index.vue';
//@ts-ignore
import SysTree from '@/components/Tree/Sys.vue';
//@ts-ignore
import TargetTree from '@/components/Tree/SingleTarget.vue';

const tabs = [
  {
    label: '目标体系',
    name: 'first',
    component: SysTree,
    icon: 'el-icon-?',
    content: 'content',
  },
  {
    label: '单目标',
    name: 'second',
    component:TargetTree,
    icon: 'el-icon-?',
    content: 'content',
  },
];

const helpInfo = ()=> {
  if (0) {
    return {
      enabled: true,
      createInfo: (name: string) => {
        return `切换至${name}失败`;
      },
      type: 'error',
    };
  }else if (1) {
    return {
      enabled: true,
      createInfo: (name: string) => {
        return `切换至${name}成功`;
      },
      type:'success',
    };
  }else {
    return {
      enabled: true,
      createInfo: (name: string) => {
        return `切换至${name}成功`;
      },
      type:'info',
    };
  }
};
</script>

<style lang="scss" scoped>
.tabs-sys-and-singleTarget {
  height: 100%;
}
</style>
