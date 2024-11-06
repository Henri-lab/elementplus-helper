<template>
    <div class="table-subtarget-maintain">
        <EnhancedTable :columns="columns" :initialData="paginatedData" :edit="false">
            <template #operation="scope">
                <el-button @click="handleCustomBtn(scope.row)" size="small">
                    关联图片
                </el-button>
                <el-button @click="handleCustomBtn(scope.row)" size="small">
                    导出
                </el-button>
            </template>
        </EnhancedTable>
        <br>

        <!-- 分页器 -->
        <EnhancedPagination :total="totalItems" :currentPage="currentPage" :pageSize="pageSize"
            @update:currentPage="onPageChange" @update:pageSize="onPageSizeChange" />
    </div>
</template>



<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import EnhancedTable from './index.vue';
//@ts-ignore
import { subTargetMaintainData } from '@/mock/table_test';
//@ts-ignore
import subTargetMaintainColums from './config/subTargetMaintain'
import EnhancedPagination from '../Pagination/index.vue';


export default defineComponent({
    components: { EnhancedTable, EnhancedPagination },
    setup() {
        const columns = subTargetMaintainColums;
        const data = subTargetMaintainData;// 模拟数据

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
