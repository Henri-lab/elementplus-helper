<template>
    <div class="test-bar" v-if="isTestBar">
        <el-button class="trigger" @click="trigger">test-bar🌞</el-button>
        <div class="btns" v-if="isTestBtns">
            <router-link class="item" to="/testComponents"><el-button>组件测试</el-button></router-link>
            <router-link class="item" to="/layout/display0/@targetSystem"><el-button>目标体系布局</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item"
                to="/layout/display1/@targetValueAnalyse"><el-button>目标价值分析布局</el-button></router-link>
            <router-link class="item"
                to="/layout/display1/targetValueAnalyse"><el-button>目标价值分析内容</el-button></router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isTestBar = ref(false);
const isTestBtns = ref(false);
const handleKeydown = (event) => {
    if (event.key === 'v' || event.key === 'V') {
        // 用户按下了 "v" 键（包括小写和大写）
        console.log('Pressed "v" key');
        // 在这里可以添加要执行的逻辑
        isTestBar.value = !isTestBar.value;
    }
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
}
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