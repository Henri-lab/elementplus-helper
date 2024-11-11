<template>
    <div class="table-target-basic-info">
        <ToolBarOfTable></ToolBarOfTable>

        <EnhancedTable :columns="columns" :initialData="paginatedData" :isAddBtn="false" :isDeleteSelected="false">
        </EnhancedTable>
        <br>

        <!-- 分页器 -->
        <EnhancedPagination :total="totalItems" :currentPage="currentPage" :pageSize="pageSize"
            @update:currentPage="onPageChange" @update:pageSize="onPageSizeChange" />
    </div>
</template>



<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
//@ts-ignore
import ToolBarOfTable from '@/components/ToolBar/OfTable.vue'
import EnhancedTable from '../index.vue';
//@ts-ignore
import { targetBasicInfoData } from '@/mock/table_test';
//@ts-ignore
import targetBasicInfoColumns from '../config/targetBasicInfo'
import EnhancedPagination from '../../Pagination/index.vue';


export default defineComponent({
    components: { EnhancedTable, EnhancedPagination, ToolBarOfTable },
    setup() {
        const columns = targetBasicInfoColumns;
        const data = targetBasicInfoData;// 模拟数据

        const handleCustomBtn = (row: any) => {
            console.log('custom button clicked:', row);
        };

        const totalItems = ref(data.length || 500); // 总条数
        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页条数

        const allData = data;

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


        return { columns, data, handleCustomBtn, totalItems, currentPage, pageSize, paginatedData, onPageChange, onPageSizeChange };
    }
});
</script>
