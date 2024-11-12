<template>
    <EnhancedTable :columns="columns" :initialData="data">
        <template #operation="scope">
            <el-button @click="handleCustomBtn(scope.row)">
                custom
            </el-button>
        </template>
    </EnhancedTable>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import EnhancedTable from './index.vue';
//@ts-ignore
import tableMockData from '@/mock/table_test';

export default defineComponent({
    components: { EnhancedTable },
    setup() {
        const columns = [
            { label: '姓名', prop: 'name', width: 100 },
            { label: '年龄', prop: 'age', width: 80 },
            { label: '职位', prop: 'job' }
        ];
        const data = tableMockData();

        const handleCustomBtn = (row: any) => {
            console.log('custom button clicked:', row);
        };

        return { columns, data, handleCustomBtn };
    }
});
</script>