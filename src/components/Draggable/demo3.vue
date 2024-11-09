<template>
  <div class="mindmap-container">
    <!-- SVG 连接线 -->
    <svg class="connections" width="100%" height="100%">
      <line
        v-for="(connection, index) in connections"
        :key="index"
        :x1="connection.x1"
        :y1="connection.y1"
        :x2="connection.x2"
        :y2="connection.y2"
        stroke="black"
        stroke-width="2"
      />
    </svg>

    <!-- 根节点 -->
    <MindMapNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      @updateConnections="updateConnections"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import MindMapNode from '../Recursion/MindMapNode.vue';

onMounted(() => {
  console.log('demo3 onMounted');
});

// 初始思维导图节点数据
const nodes = ref([
  {
    id: 1,
    name: 'Root',
    position: { x: 200, y: 100 },
    children: [
      {
        id: 2,
        name: 'Child 1',
        position: { x: 100, y: 250 },
        children: [],
      },
      {
        id: 3,
        name: 'Child 2',
        position: { x: 300, y: 250 },
        children: [
          {
            id: 4,
            name: 'Grandchild',
            position: { x: 300, y: 400 },
            children: [],
          },
        ],
      },
    ],
  },
]);

const connections = ref([]); // 存储节点之间的连接信息

// 更新连接函数
function updateConnections(newConnections) {
  connections.value = newConnections;
}
</script>

<style scoped>
.mindmap-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: red;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
