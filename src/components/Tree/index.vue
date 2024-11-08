<template>
    <ContextMenu :targetElement="targetElement" :menuItems="menuOptions"></ContextMenu>
    <el-input v-model="filterText" style="width: 240px" placeholder="Filter keyword" />
    <el-tree id="idOfTree" ref="treeRef" auto-expand-parent class="filter-tree" :data="data" :props="defaultProps"
        default-expand-all :filter-node-method="filterNode" @node-click="getNodeInfo">
        <template #default="{ node }">
            <span class="tree-node">
                <div class="checkbox">
                    <el-checkbox></el-checkbox>
                </div>
                <span class="label">
                    {{ node.label }}
                </span>
                <div class="operations image">
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

const targetElement = ref(null);
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
function sleep(t: number) {
    return new Promise((resolve) => setTimeout(resolve, t));
}



// 递归查找节点
const findNode = (data: any, nodeId: any) => {
    for (let node of data) {
        if (node.id === nodeId) {
            return node;
        }
        if (node.children) {
            const found = findNode(node.children, nodeId);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

// 添加子节点
const addNode = (parentNodeId: any, newNode: any) => {
    const parentNode = findNode(data, parentNodeId);
    if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(newNode);
    } else {
        console.warn('Parent node not found');
    }
};

// 删除节点
const deleteNode = (nodeId: any, data:any) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === nodeId) {
            data.splice(i, 1);
            return true;
        } else if (data[i].children) {
            const deleted = deleteNode(nodeId, data[i].children);
            if (deleted) return true;
        }
    }
    return false;
};

// 更新节点
const updateNode = (nodeId: any, updatedProperties: any) => {
    const node = findNode(data, nodeId);
    if (node) {
        Object.assign(node, updatedProperties);
    } else {
        console.warn('Node not found');
    }
};

// 查找节点
const searchNode = (nodeId: any) => {
    return findNode(data, nodeId);
};

onMounted(async () => {
    if (treeRef.value) {
        targetElement.value =
            treeRef.value.$refs.el$ || document.getElementById('idOfTree');
    }
    // console.log(treeRef.value.$refs.el$);
})
</script>

<style lang="scss" scoped>
.filter-tree {
    @include filter-tree;

    .tree-node {
        @include flexbox;

        .label {
            margin-right: 10px;
            cursor: pointer;
        }

        .operations {
            background-color: $bg_color;
        }
    }

}
</style>