<template>
    <div>
        <div style="color: antiquewhite; 
        font-size: 20px;
        background-color: black;
        text-align: center;
        ">
            welcome testing components!
        </div>
        <div class="test-btns">
            <div class="item" v-for="link in routerLinks" :key="link.path">
                <router-link :to="link.path">
                    <el-button>{{ link.name }}</el-button>
                </router-link>
            </div>
        </div>
        <el-divider>components</el-divider>
        <div class="components">
            <router-view></router-view>
        </div>

    </div>
</template>

<script setup>
import testRoutes from '@/router/testRoutes';
import { computed } from 'vue';

// 计算属性生成路径
const routerLinks = computed(() => {
    return testRoutes
        .flatMap(route => route.children.map(child => ({
            path: `${route.path}/${child.path}`,
            name: child.name,
        })));
});


</script>

<style lang="scss" scoped>
.test-btns {
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

.components {
    width: 80%;
    height: auto;
    padding: 10px;
    border: 1px solid red;
    box-shadow: 10px 10px 10px #e0e0e0;
    margin: 0 auto;
    overflow: visible;
}
</style>