import { computed, defineComponent, type PropType, ref, watch } from 'vue';
//@ts-ignore
import ToolBarOfTable from '@/components/ToolBar/OfTable.vue';
import EnhancedTable from '@/components/Table/index.vue';
import EnhancedPagination from '@/components/Pagination/index.vue';

// 创建动态组件的函数
export function createComponent(
    getTableData: () => any[],
    // getConfigColumnsPath: () => string,
    getConfigColumns: () => any[],
    extra?: {
        currentPage?: number,
        pageSize?: number,
        customDialog?: boolean,
        customFormName?: string,
        customFormType?: string,
    }
) {
    return defineComponent({
        components: { EnhancedTable, EnhancedPagination, ToolBarOfTable },
        setup() {
            // 动态加载列配置
            const columns = ref<any[]>([]);
            const loadConfigColumns = async () => {
                // const module = await import(getConfigColumnsPath());
                // columns.value = module.default;
                columns.value = getConfigColumns();
            };
            loadConfigColumns(); // 初次加载列配置

            const tableData = ref(getTableData()); // 动态获取表格数据
            const totalItems = ref(tableData.value.length || 0); // 总条数
            const currentPage = ref(extra?.currentPage || 1); // 当前页码
            const pageSize = ref(extra?.currentPage || 10); // 每页条数

            // 计算当前页的数据
            const paginatedData = computed(() => {
                const start = (currentPage.value - 1) * pageSize.value;
                const end = start + pageSize.value;
                return tableData.value.slice(start, end);
            });

            // 监听 tableData 的变化，更新 totalItems
            watch(
                () => getTableData(),
                (newData) => {
                    tableData.value = newData;
                    totalItems.value = newData.length;
                },
                { immediate: true }
            );

            // 页码变化
            const onPageChange = (page: number) => {
                currentPage.value = page;
            };

            // 每页条数变化
            const onPageSizeChange = (size: number) => {
                pageSize.value = size;
                currentPage.value = 1; // 重置到第一页
            };

            return () => (
                <div class="table-target-basic-info">
                    <ToolBarOfTable />

                    <EnhancedTable
                        columns={columns.value}
                        initialData={paginatedData.value}
                        isAddBtn={false}
                        isDeleteSelected={false}
                        customDialog={extra?.customDialog}
                        customFormName={extra?.customFormName}
                        customFormType={extra?.customFormType}
                    />

                    <br />

                    {/* 分页器 */}
                    <EnhancedPagination
                        total={totalItems.value}
                        currentPage={currentPage.value}
                        pageSize={pageSize.value}
                        onUpdate:currentPage={onPageChange}
                        onUpdate:pageSize={onPageSizeChange}
                    />
                </div>
            );
        },
    });
}

// 使用 createComponent 创建组件实例
