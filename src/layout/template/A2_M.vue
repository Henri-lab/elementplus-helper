<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <slot name="a1" class="a1"></slot>
        <slot name="a2" class="a2"></slot>
        <slot name="a3" class="a3"></slot>
      </el-aside>
      <el-container>
        <el-main>
          <slot name="m"></slot>
        </el-main>
      </el-container>
    </el-container>
    <el-footer>
      <slot name="f"></slot>
    </el-footer>
  </div>
</template>

<style lang="scss" scope></style>
