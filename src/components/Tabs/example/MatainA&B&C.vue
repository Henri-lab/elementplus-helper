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
  import C1 from '@/components/Tabs/example/BInfo&Image.vue';
  //@ts-ignore
  import C2 from '@/components//Tabs/example/BInfo&Image.vue';
  //@ts-ignore
  import C3 from '@/components/Other/ModelMatain.vue';
  import { markRaw } from 'vue';
  
  const tabs = [
    {
      label: '目标维护',
      name: 'basic-infos', //activie name needs it;
      component: markRaw(C1), //important!
      icon: 'el-icon-?',
      content: 'content',
    },
    {
      label: '子目标维护',
      name: 'feature-infos',
      component: markRaw(C2),
      icon: 'el-icon-?',
      content: 'content',
    },
    {
      label: '模型维护',
      name: 'theme-images',
      component: markRaw(C3),
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
  