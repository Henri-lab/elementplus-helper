<template>
  <div class="date-time-display">
    <el-card shadow="hover" class="time-card">
      <div class="date">
        {{ formattedDate }}
      </div>
      <div class="time">
        {{ formattedTime }}
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const formattedDate = ref('');
const formattedTime = ref('');

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份补零
  const day = String(now.getDate()).padStart(2, '0'); // 天补零
  formattedDate.value = `${year}-${month}-${day}`;
};

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0'); // 小时补零
  const minutes = String(now.getMinutes()).padStart(2, '0'); // 分钟补零
  const seconds = String(now.getSeconds()).padStart(2, '0'); // 秒钟补零
  formattedTime.value = `${hours}:${minutes}:${seconds}`;
};

// 更新日期和时间
const updateDateTime = () => {
  getCurrentDate();
  getCurrentTime();
};

// 定时更新
let timer: NodeJS.Timeout;
onMounted(() => {
  updateDateTime(); // 初始化显示当前时间
  timer = setInterval(updateDateTime, 1000); // 每秒更新
});

onUnmounted(() => {
  clearInterval(timer); // 组件销毁时清除定时器
});
</script>

<style scoped>
.date-time-display {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.time-card {
  width: 150px;
  text-align: center;
}

.date {
  font-size: 18px;
  font-weight: bold;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}
</style>
