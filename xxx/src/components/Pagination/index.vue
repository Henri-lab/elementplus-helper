<template>
    <div class="enhanced-pagination">
        <!-- 总条目数 -->
        <span v-if="showTotal" class="enhanced-pagination__total">
            总共 {{ total }} 条
        </span>

        <!-- 页大小选择 -->
        <el-select v-if="showSizeChanger" v-model="internalPageSize" size="small" @change="onPageSizeChange"
            class="enhanced-pagination__size">
            <el-option v-for="size in pageSizes" :key="size" :label="size + ' 条/页'" :value="size" />
        </el-select>

        <!-- 页码导航 -->
        <el-pagination :current-page="internalCurrentPage" :page-size="internalPageSize" :page-count="pageCount"
            :page-sizes="pageSizes" layout="prev, pager, next, jumper" @current-change="onPageChange" background />

        <!-- 跳转到指定页 -->
        <div v-if="showQuickJumper" class="enhanced-pagination__jumper">
            跳转到 <el-input v-model="jumpPage" size="small" @keyup.enter="onJumpPage" class="jumper-input" />
            页
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, type PropType } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: "EnhancedPagination",
    props: {
        total: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        pageSizes: {
            type: Array as PropType<number[]>,
            default: () => [10, 20, 30, 50]
        },
        showTotal: {
            type: Boolean,
            default: true
        },
        showSizeChanger: {
            type: Boolean,
            default: true
        },
        showQuickJumper: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:currentPage', 'update:pageSize'],
    setup(props, { emit }) {
        const internalCurrentPage = ref(props.currentPage);
        const internalPageSize = ref(props.pageSize);
        const jumpPage = ref('');

        // 计算总页数
        const pageCount = computed(() => Math.ceil(props.total / internalPageSize.value));

        // 更新页码
        const onPageChange = (page: number) => {
            internalCurrentPage.value = page;
            emit('update:currentPage', page);
        };

        // 更新每页条数
        const onPageSizeChange = (size: number) => {
            internalPageSize.value = size;
            internalCurrentPage.value = 1; // 重置到第一页
            emit('update:pageSize', size);
            emit('update:currentPage', 1); // 重置到第一页
        };

        // 跳转到指定页
        const onJumpPage = () => {
            const page = parseInt(jumpPage.value);
            if (page >= 1 && page <= pageCount.value) {
                onPageChange(page);
            } else {
                ElMessage.warning(`页码无效，请输入 1 到 ${pageCount.value} 之间的数字`);
            }
            jumpPage.value = ''; // 清空跳转输入框
        };

        // 监听外部传入的 `currentPage` 和 `pageSize` 变化
        watch(
            () => props.currentPage,
            (newVal) => {
                internalCurrentPage.value = newVal;
            }
        );

        watch(
            () => props.pageSize,
            (newVal) => {
                internalPageSize.value = newVal;
            }
        );

        return {
            internalCurrentPage,
            internalPageSize,
            pageCount,
            jumpPage,
            onPageChange,
            onPageSizeChange,
            onJumpPage
        };
    }
});
</script>

<style scoped lang="scss">
.enhanced-pagination {
    @include default-enhanced-pagination;
}
</style>