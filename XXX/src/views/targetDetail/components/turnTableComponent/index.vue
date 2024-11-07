<!--
 * @Author: Ming-tt m15075712681@163.com
 * @Date: 2024-06-22 14:38:37
 * @LastEditors: chenqiming chenqiming
 * @LastEditTime: 2024-07-18 08:59:20
 * @FilePath: \归档\src\components\demo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
     <div id="circle0">
        <div class="nei">
            <p @click="getOpenShow('目标详情')"></p>
            <p @click="getOpenShow('装备部署情况')"></p>
            <p @click="getOpenShow('相关事件')"></p>
            <p @click="getOpenShow('发展变化图')"></p>
            <p @click="getOpenShow('目标动态')"></p>
            <p @click="getOpenShow('历史变化')"></p>
        </div>
        <div class="neiCircle"></div>
        <div class="neiTwoCircle"></div>
        <div class="specialCircle"></div>
    </div>
  </template>
  <script setup >
  import { defineEmits } from "vue";
  const emits = defineEmits([
    "getOpenShow",
  ]);
  const getOpenShow = (e) => {
    emits("getOpenShow",e);
  };
  </script>
  
<style lang="scss" scoped>
@import "./index.scss";
</style>
  