<template>
  <div
    class="node-wrapper"
    ref="nodeRef"
    :style="{
      left: `${nodeData.position.x}px`,
      top: `${nodeData.position.y}px`,
    }"
  >
    <Draggable
      :list="nodeData.children"
      group="nodes"
      item-key="id"
      @end="updatePosition"
      @change="handleDragChange"
    >
      <template #item="{ element }">
        <div class="node-content">
          {{ element.name }}
          <!-- 递归渲染子节点 -->
          <MindMapNode :node="element" @updateConnections="emitConnections" />
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup>
//continue soon
import { ref, reactive, watch } from 'vue';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';
import MindMapNode from './MindMapNode.vue';

const props = defineProps({
  node: Object,
});
const emit = defineEmits(['updateConnections']);
const nodeRef = ref(null);

// 将 props.node 初始化为本地的可修改状态
const nodeData = reactive(JSON.parse(JSON.stringify(props.node))); // 深拷贝

// 更新位置函数
function updatePosition() {
  if (nodeRef.value) {
    const rect = nodeRef.value.getBoundingClientRect();
    nodeData.position.x = rect.left + window.scrollX;
    nodeData.position.y = rect.top + window.scrollY;
    emitConnections();
  }
}

// 处理拖拽变化
function handleDragChange(event) {
  // 更新子节点数据
  nodeData.children = event.to;
  emitConnections(); // 更新连接线
}

// 生成连接线数据
function getConnections() {
  const connections = [];
  if (nodeData.children) {
    nodeData.children.forEach((child) => {
      connections.push({
        x1: nodeData.position.x + 50,
        y1: nodeData.position.y + 25,
        x2: child.position.x + 50,
        y2: child.position.y + 25,
      });
    });
  }
  return connections;
}

// 发送连接信息
function emitConnections() {
  const connections = getConnections();
  emit('updateConnections', connections);
}

// 监听 position 的变化来更新连接线
watch(() => nodeData.position, emitConnections, { deep: true });
</script>

<style scoped>
.node-wrapper {
  position: absolute;
  cursor: move;
}

.node-content {
  background: #3498db;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}
</style>
