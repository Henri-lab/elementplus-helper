import { computed, defineComponent, type PropType, ref, watch } from 'vue';
//@ts-ignore
import ToolBarOfTable from '@/components/ToolBar/OfTable.vue';
import EnhancedTable from '@/components/Table/index.vue';
import EnhancedPagination from '@/components/Pagination/index.vue';

// 创建动态组件的函数
export function createComponent(
    getTableData: () => any[],
    getConfigColumns: () => any[],
    extra?: {
        currentPage?: number;
        pageSize?: number;
        customDialog?: boolean;
        customFormName?: string;
        customFormType?: string;
        customButtons?: Array<{ label: string; onClick: (row: any) => void }>;
        innerFormTemplate?: any;
        onSubmit?: (arg: any) => any;
    },
    name?: string,
) {
    return defineComponent({
        name: name || 'DynamicEnhancedTable',
        components: { EnhancedTable, EnhancedPagination, ToolBarOfTable },
        setup() {
            // 动态加载列配置
            const columns = ref<any[]>([]);
            const loadConfigColumns = async () => {
                columns.value = getConfigColumns();
            };
            loadConfigColumns(); // 初次加载列配置

            // 初始化按钮配置
            const buttons = ref(extra?.customButtons || []);

            // 初始化表格数据
            const tableData = ref(getTableData());
            const totalItems = ref(tableData.value.length); // 总条数
            const currentPage = ref(extra?.currentPage || 1); // 当前页码
            const pageSize = ref(extra?.pageSize || 10); // 每页条数

            // 计算当前页数据
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
                    {/* 工具栏 */}
                    <ToolBarOfTable />

                    {/* 表格 */}
                    <EnhancedTable
                        columns={columns.value}
                        initialData={paginatedData.value}
                        isAddBtn={false}
                        isDeleteSelected={false}
                        customDialog={extra?.customDialog}
                        customFormName={extra?.customFormName}
                        customFormType={extra?.customFormType}
                        innerFormTemplate={extra?.innerFormTemplate}
                        onAfterAddRow={extra?.onSubmit}
                    >
                        {{
                            operation: ({ row }: { row: any }) => (
                                <>
                                    {buttons.value.map((button, index) => (
                                        <el-button
                                            key={index}
                                            size="small"
                                            onClick={() => button.onClick(row)}
                                        >
                                            {button.label}
                                        </el-button>
                                    ))}
                                </>
                            ),
                        }}
                    </EnhancedTable>

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