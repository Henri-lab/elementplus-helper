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
      <img src="../../../../assets/images/转盘外圈.png" style="height: 260px" />
      <ul id="left">
        <li class="sector" style="--rotate-angle: 0deg" @click="getOpenShow('目标详情')">
          <span style="margin-top: -25px">目标详情</span>
        </li>
        <li class="sector" style="--rotate-angle: 60deg" @click="getOpenShow('装备部署情况')">
          <span style="margin-top: -30px; rotate: -50deg">装备部署情况</span>
        </li>
        <li
          class="sector"
          style="--rotate-angle: 120deg"
          @click="getOpenShow('相关事件')"
        >
          <span style="rotate: 254deg; margin-top: -30px">相关事件</span>
        </li>
        <li class="sector" style="--rotate-angle: 180deg" @click="getOpenShow('发展变化图')">
          <span style="rotate: 160deg; margin-top: -43px; margin-left: 143px"
            >发展变化图</span
          >
        </li>
        <li class="sector" style="--rotate-angle: 240deg" @click="getOpenShow('目标动态')">
          <span style="rotate: 92deg; margin-top: -24px">目标动态</span>
        </li>
        <li class="sector" style="--rotate-angle: 300deg" @click="getOpenShow('历史变化')">
          <span style="margin-top: -22px; rotate: 65deg">历史变化</span>
        </li>
      </ul>
      <div class="circleN"></div>
      <div class="neiCircle"></div>
      <div class="neiTwoCircle"></div>
      <div class="specialCircle"></div>
      <!-- <div class="circleNei"></div> -->
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
  