<template>
    <div class="tool-bar-of-table">
        <el-form :model="form" label-width="80px" class="form">
            <el-form-item label="目标名称" class="name-input">
                <el-input type="text" v-model="form.targetName" placeholder="目标名称"
                    aria-label="targetNameSearchInput"></el-input>
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
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
//@ts-ignore
import $bus from '@/utils/bus';
import { onMounted, ref } from 'vue';
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