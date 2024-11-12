<template>
  <div class="tabs-sys-and-singleTarget">
    <Tabs
      :tabs="tabs"
      :isGuard="false"
      :isControlPanel="false"
      initName="target-sys"
    ></Tabs>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import Tabs from '../index.vue';
//@ts-ignore
import C1 from '@/components/Tree/example/Sys.vue';
//@ts-ignore
import C2 from '@/components/Tree/example/SingleTarget.vue';
import { markRaw, onMounted } from 'vue';

import { useRoute } from 'vue-router';

const tabs = [
  {
    label: '目标体系',
    name: 'target-sys',
    component: markRaw(C1), //important!
    icon: 'el-icon-?',
    content: 'content',
    // props: {
    //   treeData: [],
    // },
  },
  {
    label: '单目标',
    name: 'single-target',
    component: markRaw(C2),
    icon: 'el-icon-?',
    content: 'content',
    // props: {
    //   treeData: [],
    // },
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

const route = useRoute();
onMounted(() => {
  console.log('route', route);
});
</script>

<style lang="scss" scoped>
.tabs-sys-and-singleTarget {
  height: 100%;
}
</style>
