<template>
  <div class="common-header">
    <div class="left">
      <div class="item" v-for="link in routerLinks" :key="link.path">
        <router-link :to="link.path">
          <el-button class="link">{{ link.name }}</el-button>
        </router-link>
      </div>
    </div>
    <div class="right">
      <div class="time-bar">
        <DataAndTime />
      </div>
      <div class="userInfo">
        <el-tag>用户</el-tag>
      </div>
      <div class="switch">
        <el-image src="../../assets/image/logo.png"></el-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import DataAndTime from '../DataAndTime/base.vue';

const routerLinks = [
  { path: '/layout/display0/targetSystem', name: '目标体系' },
  { path: '/layout/display1/targetValueAnalyse', name: '目标价值分析' },
  { path: '/layout/display0/dataMaintain', name: '数据维护' },
];
</script>

<style lang="scss" scoped>
.common-header {
  @include common-header;
}
</style>
