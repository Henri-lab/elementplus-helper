<script lang="ts">
import { onMounted, onBeforeUnmount, defineComponent } from 'vue';
//@ts-ignore
import AppTest from './AppTest.vue';
//@ts-ignore
import AppDialogs from './AppDialogs.vue';
//@ts-ignore
import AppBus from './AppBus.vue';
import Module from 'module';
import { getInitialsFromChinese } from './utils/format';
export default defineComponent({
  components: { AppTest, AppDialogs, AppBus },
  setup() {
    const designWidth = 1920; // 设计图的宽度
    const designHeight = 1080; // 设计图的高度

    // 页面比例调整函数
    const adjustScale = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 计算宽度和高度的缩放比例，并取最小值以保持比例
      const scaleWidth = screenWidth / designWidth;
      const scaleHeight = screenHeight / designHeight;
      const scale = Math.min(scaleWidth, scaleHeight);

      // 应用缩放比例到根容器
      const container = document.querySelector(
        '.scale-container'
      ) as HTMLElement;
      if (container) {
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'top left';
      }
    };

    // 绑定和解绑窗口大小变化事件
    onMounted(() => {
      adjustScale();
      window.addEventListener('resize', adjustScale);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', adjustScale);
    });

    return {
      designWidth,
      designHeight,
    };
  },
});
</script>

<template>
  <div id="app">
    <AppTest />
    <AppBus />
    <AppDialogs />
    <RouterView />
  </div>
</template>

<style lang="scss" scoped></style>
