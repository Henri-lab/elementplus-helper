<template>
    <div class="tool-bar-of-table">
        <el-form :model="form" label-width="80px" class="form">
            <el-form-item label="目标名称" class="name-input">
                <el-input type="text" v-model="form.targetName" placeholder="请输入关键词" aria-label="targetNameSearchInput"
                    @input="getRecommend" clearable></el-input>
                <!-- 显示搜索建议 -->
                <el-dropdown v-if="suggestions.length > 0" class="recommend">
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="(suggestion, index) in suggestions" :key="index"
                            @click="selectSuggestion(suggestion)">
                            {{ suggestion }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
            <el-form-item label="描述" class="desc">
                <el-input type="text" v-model="form.desc" placeholder="请输入描述" />
            </el-form-item>
        </el-form>

        <div class="btns">
            <el-button type="primary" class="search" @click="searchByTargetName">
                查询
            </el-button>
            <el-button type="primary" class="download">
                下载模版
            </el-button>
            <el-button type="primary" class="import">
                批量导入
            </el-button>
            <el-button type="primary" class="new" @click="add_row">
                新增
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
//@ts-ignore
import $bus from '@/utils/bus';
import { computed, onMounted, ref, watchEffect } from 'vue';
const form = ref({
    targetName: '',
    desc: ''
})

const searchByTargetName = () => {
    $bus.emit('Table:searchByTargetName', form.value.targetName)
}

const add_row = () => {
    $bus.emit('Table:add_row')
}


//基于 el-input 和 Fuse.js 实现关键词搜索推荐
const suggestions = ref([]);

// 模拟数据集
const data = [
    { title: 'Vue.js 3 快速入门' },
    { title: 'JavaScript 深入解析' },
    { title: 'Element Plus 高级指南' },
    { title: '前端性能优化' },
    { title: 'JavaScript 数据结构与算法' },
];

// 配置 Fuse.js 的模糊搜索选项
const fuse = new Fuse(data, {
    keys: ['title'],
    threshold: 0.4, // 控制模糊匹配的精确度
});

// 处理搜索并更新推荐列表
const getRecommend = () => {
    const result = fuse.search(form.value.targetName);
    //@ts-ignore
    suggestions.value = result.map((item) => item.item.title);
};

// 选择推荐的关键词
const selectSuggestion = (suggestion:string) => {
    form.value.targetName= suggestion;
    suggestions.value = [];
};

</script>

<style lang="scss" scoped>
.tool-bar-of-table {
    @include flexbox;
    background-color: beige;
    gap: 10px;

    .form {
        @include flexbox;
        margin-left: 20px;
        margin-top: 20px;
    }

    .desc {
        @include flexbox;
    }
}
</style>