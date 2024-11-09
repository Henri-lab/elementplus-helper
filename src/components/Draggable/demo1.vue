<template>
  <div>
    <h2 class="luminous">Vue Draggable Next 基本示例</h2>
    <br />
    <Draggable
      v-model="items"
      :animation="300"
      :disabled="isDragDisabled"
      ghost-class="ghost"
      chosen-class="chosen"
      drag-class="drag"
      handle=".drag-handle"
      @end="onDragEnd"
      :move="onMove"
    >
      <div v-for="item in items" :key="item.id" class="draggable-item">
        <div
          :class="{ 'drag-handle': true, 'drag-forbid-handle': item.noDrag }"
        >
          ☰
        </div>
        {{ item.name }}
        <span v-if="item.noDrag" class="no-drag-text">(不可拖拽)</span>
      </div>
    </Draggable>
    <el-button @click="toggleDrag" style="margin-top: 10px">
      {{ isDragDisabled ? '启用拖拽' : '禁用拖拽' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

// 拖拽列表的数据
const items = ref([
  { id: 1, name: '项目 A' },
  { id: 2, name: '项目 B', noDrag: true },
  { id: 3, name: '项目 C' },
  { id: 4, name: '项目 D' },
]);

// 用于禁用/启用拖拽的状态
const isDragDisabled = ref(false);

// 切换拖拽状态
const toggleDrag = () => {
  isDragDisabled.value = !isDragDisabled.value;
};

// 拖拽结束的回调
const onDragEnd = (event: any) => {
  const dom: HTMLElement = event.item;
  dom.classList.remove('no-drag');
  console.log('@end:', event);
};

const onMove = (event: any, originalEvent: any) => {
  //   console.log('onMove:', event, originalEvent);
  // drag: el---->el2
  const item = event.draggedContext.element; //not html element
  const to_item = event.relatedContext.element;
  const dom: HTMLElement = event.dragged;
  const to_dom = event.related;
  if (item.noDrag) {
    console.log(
      `%c<${item.name}>不可拖拽`,
      'color: white; background-color: red; font-size: 12px; padding: 4px;'
    );
    dom.classList.add('no-drag');
    return false;
  }
};
</script>

<style lang="scss" scoped>
.luminous {
  @include multi-glow-text;
}
.draggable-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 拖拽项的基础样式 */
.draggable-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

/* 拖拽手柄样式 */
.drag-handle {
  cursor: grab;
  margin-right: 10px;
  color: #555;
}

.drag-forbid-handle {
  cursor: not-allowed !important;
}

/* 拖拽时的 CSS 类 */
.ghost {
  opacity: 0.5;
  background-color: #ffeb3b;
}

.chosen {
  @include animate-glowing-border-scale;
}

.drag {
  opacity: 0.5;
  background-color: gainsboro;
}

/* 不可拖拽的元素样式 */
.no-drag {
  color: rgb(244, 4, 4);
  background-color: gray;
}
</style>
