<template>
    <div class="test-bar">
        <el-button class="trigger" @click="trigger">test-bar🌞</el-button>
        <div class="btns" v-if="isTest">
            <router-link class="item" to="/layout/display0/@targetSystem"><el-button>目标体系布局</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
            <router-link class="item" to="/layout/display0/targetSystem"><el-button>目标体系内容</el-button></router-link>
        </div>
    </div>
</template>

<script setup>
const isTest = ref(false);

const trigger = () => {
    isTest.value = !isTest.value;
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