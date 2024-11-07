<!--
 * @Author: XC
 * @Date: 2024-07-18 10:44:17
 * @LastEditors: XC
 * @LastEditTime: 2024-07-18 11:08:09
 * @FilePath: \RuoYi-Vue3-3.8.6\src\components\management\TableCellTip.vue
 * @Description: 
-->
<template>
  <el-popover placement="top"  trigger="hover" :popper-style="{background:'#132539',color:'#fff', borderColor:'#1a5076'}">
    <el-row>
      <p>已完成: {{ props.content.finish }}个目标</p>
    </el-row>
    <el-row>
      <p>进行中: {{ props.content.underway }}个目标</p>
    </el-row>
    <el-row>
      <p>未开始: {{ props.content.notStart }}个目标</p>
    </el-row>
    <template #reference>
      <span v-if="props.content.taskStatus === 0" style="color:chocolate"> 未开始 </span>
      <span v-if="props.content.taskStatus === 1" style="color:yellow"> 进行中 </span>
    <span v-if="props.content.taskStatus === 2"  style="color:chartreuse"> 已完成 </span>
    </template>
  </el-popover>
</template>
<script setup>
import {defineProps} from 'vue'
let props = defineProps({
  content: {
    type: Object,
    default: "",
  },
});
</script>
<style scoped lang="scss">
::v-deep .el-popper.is-light{
  border:1px solid #1a5076;
}
p{
  line-height: 30px;
  text-align: center;
}
</style>