<template>
  <div class="tabs-basicInfos-and-images">
    <Tabs
      :tabs="tabs"
      :isGuard="false"
      :isControlPanel="false"
      initName="basic-infos"
    ></Tabs>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import Tabs from '../index.vue';
//@ts-ignore
import C1 from '@/components/Table/example/SubTargetBasicInfo.ts';
//@ts-ignore
import C2 from '@/components/Table/example/SubThemeImages.ts';
import { markRaw } from 'vue';

const tabs = [
  {
    label: '基本信息',
    name: 'basic-infos', //activie name needs it;
    component: markRaw(C1), //important!
    icon: 'el-icon-?',
    content: 'content',
  },
  {
    label: '专题图',
    name: 'theme-images',
    component: markRaw(C2),
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
.tabs-sys-and-singleTarget {
  height: 100%;
}
</style>
