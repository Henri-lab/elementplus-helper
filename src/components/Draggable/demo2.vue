<template>
  <div class="container">
    <div class="left">
      <h2 class="luminous">关联图片</h2>
      <br />
      <Draggable
        v-model="tasks.related"
        :group="{ name: 'tasks', pull: true, put: true }"
        animation="1000"
        ghost-class="ghost"
        drag-class="drag"
        chosen-class="chosen"
        @start="onDragStart1"
        @end="onDragEnd1"
      >
        <div v-for="task in tasks.related" :key="task.id" class="task-item">
          {{ task.name }}
        </div>
      </Draggable>
    </div>

    <!-- direction -->
    <div class="shuttle-container">
      <div class="arrow arrow-left" v-show="click_left"></div>
      <div class="arrow arrow-right" v-show="click_right"></div>
    </div>

    <div class="right">
      <h2 class="luminous">其他图片</h2>
      <br />
      <Draggable
        v-model="tasks.rest"
        :group="{ name: 'tasks', pull: true, put: true }"
        animation="1000"
        ghost-class="ghost"
        drag-class="drag"
        chosen-class="chosen"
        @start="onDragStart2"
        @end="onDragEnd2"
      >
        <div v-for="task in tasks.rest" :key="task.id" class="task-item">
          {{ task.name }}
        </div>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

// 定义两个列表数据
const getTestData = (a: number, b: number) => {
  const tasks = [];
  for (let i = a; i <= b; i++) {
    tasks.push({ id: i, name: `image ${i}`, url: '' } as never);
  }
  return tasks as any;
};
const tasks = ref({
  related: getTestData(0, 3),
  rest: getTestData(4, 10),
});

const click_left = ref(false);
const click_right = ref(false);
const goToRight = () => {
  click_right.value = true;
  click_left.value = false;
};
const goToLeft = () => {
  click_right.value = false;
  click_left.value = true;
};
const stop = () => {
  click_right.value = false;
  click_left.value = false;
};
const onDragStart1 = (event: any) => {
  //   console.log('@start:', event);
  goToRight();
};

const onDragEnd1 = (event: any) => {
  //   console.log('@end:', event);
  stop();
};

const onDragStart2 = (event: any) => {
  //   console.log('@start:', event);
  goToLeft();
};

const onDragEnd2 = (event: any) => {
  //   console.log('@end:', event);
  stop();
};
</script>

<style lang="scss" scoped>
.luminous {
  @include multi-glow-text;
}
.container {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
  .left,
  .right {
    width: 40%;
  }
  position: relative;
}

.task-item {
  width: 200px;
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border: 1px solid #00ffdd;
  @include box-shadow;
  cursor: grab;
}

.ghost {
  opacity: 0.4;
  background-color: gray;
}

.drag {
  opacity: 0.4;
}

.chosen {
  @include animate-glowing-border-scale(1, 1.2);
}

//arrow
.shuttle-container {
  display: flex;
  align-items: center;
  gap: 40px; /* 增大箭头之间的间距 */
  //   border: 5px dashed wheat;
  position: absolute;
  top: 50%;
  left: 37%;
  transform: translate(-50%, -50%);
}

.arrow {
  width: 0;
  height: 0;
  border-top: 20px solid transparent; /* 增大箭头高度 */
  border-bottom: 20px solid transparent;
}

.arrow-left {
  border-right: 100px solid #3498db; /* 增大左箭头的宽度和颜色 */
  animation: arrow-shuttle-left 0.8s infinite alternate;
}

.arrow-right {
  border-left: 100px solid #3498db; /* 增大右箭头的宽度和颜色 */
  animation: arrow-shuttle-right 0.8s infinite alternate;
}

@keyframes arrow-shuttle-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-8px); /* 增加移动距离 */
  }
}

@keyframes arrow-shuttle-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(16px); /* 增加移动距离 */
  }
}
</style>
