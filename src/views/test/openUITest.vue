<template>
  <div>
    <div
      class="luminous-strong"
      style="color: antiquewhite; font-size: 60px; text-align: center"
    >
      welcome testing openUI Comps!
    </div>
    <br />
    <div class="test-btns">
      <div class="item" v-for="link in routerLinks" :key="link.path">
        <router-link :to="link.path">
          <el-button class="luminous">{{ link.name }}</el-button>
        </router-link>
      </div>
    </div>
    <el-divider>components</el-divider>
    <div class="components">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import testRoutes from '@/router/openUITestRoutes';
import { computed } from 'vue';

// 计算属性生成路径
const routerLinks = computed(() => {
  return testRoutes.flatMap((route) =>
    route.children.map((child) => ({
      path: `${route.path}/${child.path}`,
      name: child.name,
    }))
  );
});
</script>

<style lang="scss" scoped>
.luminous-strong {
  @include strong-glow-text;
}

.luminous {
  @include glow-text;
}
.test-btns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* 自动填充列，最小200px，最大填满 */
  gap: 10px;
  height: 200px;
  overflow: scroll;

  .item {
    padding: 10px;
    border: 2px dashed rgb(20, 215, 192);
    text-align: center;
    height: 60px;
  }
}

.components {
  width: 80%;
  height: 700px;
  padding: 10px;
  border: 1px solid red;
  box-shadow: 10px 10px 10px #e0e0e0;
  margin: 0 auto;
  overflow: visible;
}
</style>
