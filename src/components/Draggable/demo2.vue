<template>
  <div class="container">
    <h2 class="luminous">待处理任务</h2>
    <br />
    <Draggable
      v-model="tasks.todo"
      :group="{ name: 'tasks', pull: 'clone', put: false }"
      animation="200"
      ghost-class="ghost"
    >
      <div v-for="task in tasks.todo" :key="task.id" class="task-item">
        {{ task.name }}
      </div>
    </Draggable>

    <h2 class="luminous">已完成任务</h2>
    <br />
    <Draggable
      v-model="tasks.done"
      :group="{ name: 'tasks', pull: true, put: true }"
      animation="200"
      ghost-class="ghost"
    >
      <div v-for="task in tasks.done" :key="task.id" class="task-item">
        {{ task.name }}
      </div>
    </Draggable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

// 定义两个列表数据
const tasks = ref({
  todo: [
    { id: 1, name: '任务 1' },
    { id: 2, name: '任务 2' },
    { id: 3, name: '任务 3' },
  ],
  done: [
    { id: 4, name: '任务 4' },
    { id: 5, name: '任务 5' },
  ],
});
</script>

<style lang="scss" scoped>
.luminous {
  @include multi-glow-text;
}
.container {
  display: flex;
  gap: 20px;
}

.task-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.ghost {
  opacity: 0.4;
  background-color: #ffeb3b;
}
</style>
