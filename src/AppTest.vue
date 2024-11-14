<template>
  <div class="test-bar" v-if="isTestBar">
    <AppRoot />
    <el-button class="trigger" @click="trigger">快速浏览🌞</el-button>
    <el-button @click="redirectToOtherPort">React项目😌</el-button>

    <div class="btns" v-if="isTestBtns">
      <router-link class="item" to="/testComponents">
        <el-button>组件测试</el-button>
      </router-link>
      <router-link class="item" to="/layout/display0/targetSystem">
        <el-button>页面入口</el-button>
      </router-link>
      <router-link class="item" to="/openUIComp">
        <el-button>OpenUI</el-button>
      </router-link>
    </div>
    <div class="routerInfo">
      <div class="route-compInfo">
        <h3 style="background: pink">route_comp_path:</h3>
        <h2>{{ matchedComponents }}</h2>
      </div>
      <span style="background: pink">route-name:</span>
      <span>{{ route.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppRoot from './AppRoot.vue';

const route = useRoute();
const isTestBar = ref(false);
const isTestBtns = ref(false);
const handleKeydown = (event) => {
  if (event.key === 'v' || event.key === 'V') {
    // 用户按下了 "v" 键（包括小写和大写）
    if (!isTestBar.value) {
      console.log(
        '%cWelcome!🎉🎉🎉',
        'color: black; background-color: wheat; font-size: 12px; padding: 4px;'
      );
    } else {
      console.log(
        '%cBye!🌛🌛🌛',
        'color: wheat; background-color: black; font-size: 12px; padding: 4px;'
      );
    }
    // 在这里可以添加要执行的逻辑
    isTestBar.value = !isTestBar.value;
  }
};

// 获取当前匹配的组件信息
const matchedComponents = computed(() => {
  const components = {};
  route.matched.forEach((record) => {
    Object.assign(components, record.components);
  });
  return components.default.__file;
});
const redirectToOtherPort = () => {
  window.location.href = 'http://localhost:3001'; // 目标端口地址
};
// 绑定事件
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

// 解绑事件，防止内存泄漏
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
const trigger = () => {
  isTestBtns.value = !isTestBtns.value;
};

//其他测试
onMounted(() => {});
</script>

<style lang="scss" scoped>
.test-bar {
  width: 100%;
  background-color: rgb(154, 170, 152);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  border: 1px solid red;

  .btns {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    /* 自动填充列，最小200px，最大填满 */
    gap: 10px;

    .item {
      padding: 10px;
      background-color: #e0e0e0;
      text-align: center;
    }
  }
}
</style>
