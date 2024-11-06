<template>
    <div>
        <!-- 数据列表表格 -->
        <el-table :data="paginatedData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="name" label="名称" />
        </el-table>

        <!-- 分页器 -->
        <EnhancedPagination :total="totalItems" :currentPage="currentPage" :pageSize="pageSize"
            @update:currentPage="onPageChange" @update:pageSize="onPageSizeChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import EnhancedPagination from './index.vue';

export default defineComponent({
    components: { EnhancedPagination },
    setup() {
        const totalItems = ref(500); // 总条数
        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页条数

        // 模拟数据
        const allData = Array.from({ length: totalItems.value }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`
        }));

        // 计算当前页的数据
        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value;
            const end = start + pageSize.value;
            return allData.slice(start, end);
        });

        // 页码变化
        const onPageChange = (page: number) => {
            currentPage.value = page;
        };

        // 每页条数变化
        const onPageSizeChange = (size: number) => {
            pageSize.value = size;
            currentPage.value = 1; // 重置到第一页
        };

        return {
            totalItems,
            currentPage,
            pageSize,
            paginatedData,
            onPageChange,
            onPageSizeChange
        };
    }
});
</script>