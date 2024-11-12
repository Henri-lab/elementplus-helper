<template>
  <div class="password-listener">
    <p class="luminous">TRY INPUT MY NAME!</p>
    <div v-if="matched" class="secret-message">🎉 Secret Code Matched! 🎉</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import $bus from './utils/bus';

const targetPassword = 'henri'; // 目标密码或按键序列
const inputSequence = ref(''); // 用户输入的按键序列
const matched = ref(false); // 匹配状态

const fail = () => {
  matched.value = false;
  $bus.emit('$:Test:showTestButton', false);
};
const success = () => {
  matched.value = true;
  $bus.emit('$:Test:showTestButton', true);
  setTimeout(() => (matched.value = false), 3000); // 3秒后隐藏匹配信息
};
// 处理按键输入
const handleKeydown = (event: KeyboardEvent) => {
  inputSequence.value += event.key; // 记录按键

  // 如果当前输入超过目标密码长度，截取最末尾的部分
  if (inputSequence.value.length > targetPassword.length) {
    inputSequence.value = inputSequence.value.slice(-targetPassword.length);
  }

  // 检测输入是否匹配目标密码
  if (inputSequence.value === targetPassword) {
    success();
  } else if (inputSequence.value == 'x') {
    fail();
  } else {
    fail();
  }
};

// 监听和移除键盘事件
onMounted(() => {
  console.log('demo1 onMounted');

  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.luminous {
  color: greenyellow;
  font-size: 20px;
  background: black;
  border: 1px solid red;
  box-shadow: 10px 10px 10px black;
}

.password-listener {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.secret-message {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #09f6a7;
}
</style>
