<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index"
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

// ::-webkit-scrollbar {
//   width: 6px;
//   height: 6px;
// }

// ::-webkit-scrollbar-track {
//   background-color: #f1f1f1;
// }

// ::-webkit-scrollbar-thumb {
//   background-color: #c0c0c0;
//   border-radius: 3px;
// }
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(117, 146, 168, 1);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

/* 内层滚动槽 */
::-webkit-scrollbar-track-piece {
  width: 2px;
  background: rgba(30, 52, 68, 1);
}
</style>

