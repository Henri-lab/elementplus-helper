<template>
    <div class="enhanced-table">
        <!-- 表格操作按钮 -->
        <el-button type="primary" @click="handleAdd" class="enhanced-table__add-button">新增</el-button>
        <el-button type="danger" @click="handleDeleteSelected" class="enhanced-table__delete-selected">删除选中</el-button>

        <!-- 表格 -->
        <el-table ref="tableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
            class="enhanced-table__table">

            <!-- 多选列 -->
            <el-table-column type="selection" width="50" />

            <!-- 动态渲染列 -->
            <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label"
                :width="column.width || 'auto'">
                <!-- 处理文本溢出 -->
                <template #default="{ row, column }">
                    <el-tooltip v-if="isTextOverflow(row[column.property])" class="enhanced-table__tooltip"
                        :content="row[column.property]" effect="dark" placement="right-end" trigger="hover"
                        :show-after="300" :hide-after="500" popper-class="custom-tooltip">
                        <div class="cell-ellipsis">{{ row[column.property] }}</div>
                    </el-tooltip>
                    <div v-else class="cell-ellipsis">{{ row[column.property] }}</div>
                </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <div class="enhanced-table__operations">
                        <el-button @click="handleEdit(row)" size="small"
                            class="enhanced-table__button--edit">编辑</el-button>
                        <el-button @click="handleDelete(row)" type="danger" size="small"
                            class="enhanced-table__button--delete">删除</el-button>
                        <slot name="operation" :row="row"></slot>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑/新增对话框 -->
        <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑数据' : '新增数据'" class="enhanced-table__dialog">
            <el-form :model="form" class="enhanced-table__form">
                <el-form-item v-for="column in columns" :key="column.prop" :label="column.label"
                    class="enhanced-table__form-item">
                    <el-input v-model="form[column.prop]" :placeholder="`请输入${column.label}`"
                        class="enhanced-table__input" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="enhanced-table__dialog-footer">
                    <el-button @click="dialogVisible = false" class="enhanced-table__button--cancel">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" class="enhanced-table__button--save">保存</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

export default defineComponent({
    props: {
        columns: {
            type: Array,
            required: true,
            default: () => []
        },
        initialData: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    setup(props) {
        const tableData = ref([...props.initialData]); // 表格数据
        const dialogVisible = ref(false); // 控制对话框显示
        const form = ref({}); // 表单数据
        const isEditing = ref(false); // 是否为编辑模式
        const currentIndex = ref(-1); // 当前编辑项索引
        const selectedRows = ref([]); // 存储选中的行数据
        const tableRef = ref(null); // 表格引用

        // 监听 `initialData` 的变化并同步更新 `tableData`
        watch(
            () => props.initialData,
            (newData) => {
                tableData.value = [...newData];
            },
            { deep: true } // 深度监听
        );

        // 新增
        const handleAdd = () => {
            form.value = {};
            isEditing.value = false;
            dialogVisible.value = true;
        };

        // 编辑
        const handleEdit = (row) => {
            form.value = { ...row };
            currentIndex.value = tableData.value.indexOf(row);
            isEditing.value = true;
            dialogVisible.value = true;
        };

        // 删除单行
        const handleDelete = (row) => {
            ElMessageBox.confirm('确认删除这条记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                tableData.value = tableData.value.filter(item => item !== row);
                ElMessage.success('删除成功');
            }).catch(() => { });
        };

        // 删除选中行
        const handleDeleteSelected = () => {
            ElMessageBox.confirm('确认删除选中的记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                tableData.value = tableData.value.filter(item => !selectedRows.value.includes(item));
                selectedRows.value = []; // 清空已选
                ElMessage.success('删除成功');
            }).catch(() => { });
        };

        // 提交表单
        const handleSubmit = () => {
            if (isEditing.value) {
                // 更新数据
                tableData.value[currentIndex.value] = { ...form.value };
                ElMessage.success('编辑成功');
            } else {
                // 新增数据
                tableData.value.push({ ...form.value });
                ElMessage.success('新增成功');
            }
            dialogVisible.value = false;
        };

        // 处理多选变更
        const handleSelectionChange = (rows) => {
            selectedRows.value = rows;
        };

        // 处理文本溢出
        const isTextOverflow = (content: string) => {
            if (!content) return false;
            else if (content.toString().length < 20) return false
            else return true;
        }

        return {
            tableData,
            dialogVisible,
            form,
            isEditing,
            handleAdd,
            handleEdit,
            handleDelete,
            handleDeleteSelected,
            handleSubmit,
            handleSelectionChange,
            tableRef,
            selectedRows,
            isTextOverflow
        };
    }
});
</script>

<style lang="scss" scoped>
.enhanced-table {
    @include default-enhanced-table;

   

}
</style>