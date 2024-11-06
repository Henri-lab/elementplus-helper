<template>
    <ContextMenu :menuItems="menuOptions"></ContextMenu>
    <el-input v-model="filterText" style="width: 240px" placeholder="Filter keyword" />
    <el-tree ref="treeRef" auto-expand-parent class="filter-tree" :data="data" :props="defaultProps" default-expand-all
        :filter-node-method="filterNode" @node-click="getNodeInfo">
        <template #default="{ node, data }">
            <span class="tree-node">
                <span class="label">
                    {{ node.label }}
                </span>
                <div class="image">
                    <el-image :src="connection" style="height: 16px;" fit="cover" />
                    <el-image :src="addone" style="height: 16px;margin: 0 5px;" fit="none" />
                    <el-image :src="Delete" style="height: 16px;" fit="cover" />
                </div>
            </span>
        </template>
    </el-tree>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElTree } from 'element-plus'
//@ts-ignore
import mockData from '@/mock/tree_node';
//@ts-ignore
import ContextMenu from '../ContextMenu/index.vue'
//@ts-ignore
import connection from '@/assets/image/connection.png';
//@ts-ignore
import addone from '@/assets/image/add-one.png';
//@ts-ignore
import Delete from '@/assets/image/delete.png';

interface Tree {
    [key: string]: any
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
    children: 'children',
    label: 'label',
}

const menuOptions = [
    {
        label: '添加',
        action: () => {
            console.log('添加')
        }
    },
    {
        label: '删除',
        action: () => {
            console.log('删除')
        }
    }
]
watch(filterText, (val) => {
    treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
    if (!value) return true
    return data.label.includes(value)
}

const data: Tree[] = mockData

const getNodeInfo = (node: Tree) => {
    console.log('获取节点信息:', node)
}

onMounted(() => {
    console.log(mockData);
})
</script>

<style lang="scss" scoped>
.filter-tree {
    @include filter-tree;

    .tree-node {
        @include flexbox;
        .label{
             margin-right: 10px;
             cursor: pointer;
        }
        .image {
            background-color: black;
        }
    }

}
</style>