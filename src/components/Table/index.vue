<template>
  <div class="enhanced-table">
    <!-- 表格操作按钮 -->
    <el-button
      v-if="isAddBtn"
      type="primary"
      @click="handleAdd"
      class="enhanced-table__add-button"
      >新增</el-button
    >
    <el-button
      v-if="isDeleteSelected"
      type="danger"
      @click="handleDeleteSelected"
      class="enhanced-table__delete-selected"
      >删除选中</el-button
    >

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="enhanced-table__table"
      :row-class-name="tableRowClassName"
      highlight-current-row
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="50" align="center" />

      <!-- 动态渲染列 -->
      <el-table-column
        align="center"
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width || 'auto'"
      >
        <!-- 处理文本溢出 -->
        <template #default="{ row, column }">
          <el-tooltip
            v-if="isTextOverflow(row[column.property])"
            class="enhanced-table__tooltip"
            :content="row[column.property]"
            effect="dark"
            placement="right-end"
            trigger="hover"
            :show-after="300"
            :hide-after="500"
            popper-class="custom-tooltip"
          >
            <div class="cell-ellipsis">{{ row[column.property] }}</div>
          </el-tooltip>
          <div v-else class="cell-ellipsis">{{ row[column.property] }}</div>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <div class="enhanced-table__operations">
            <el-button
              v-if="isEdit"
              @click="handleEdit(row)"
              size="small"
              class="enhanced-table__button--edit"
              >编辑</el-button
            >
            <slot name="operation" :row="row"></slot>
            <el-button
              v-if="isDelete"
              @click="handleDelete(row)"
              type="danger"
              size="small"
              class="enhanced-table__button--delete"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑数据' : '新增数据'"
      class="enhanced-table__dialog"
      @close="dialogVisible = false"
      @keydown.enter="handleSubmit"
    >
      <el-form
        :model="form"
        class="enhanced-table__form"
        ref="innerForm"
        :rules="rules"
      >
        <el-form-item
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          class="enhanced-table__form-item"
        >
          <el-input
            v-model="form[column.prop]"
            :placeholder="`请输入${column.label}`"
            class="enhanced-table__input"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="enhanced-table__dialog-footer">
          <el-button
            @click="dialogVisible = false"
            class="enhanced-table__button--cancel"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="handleSubmit"
            class="enhanced-table__button--save"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import { openFormDialog } from '@/utils/bus';

export default defineComponent({
  props: {
    columns: {
      type: Array<any>,
      required: true,
      default: () => [],
    },
    initialData: {
      type: Array<any>,
      required: true,
      default: () => [],
    },
    edit: {
      type: Boolean,
      default: true,
    },
    delete: {
      type: Boolean,
      default: true,
    },
    isAddBtn: {
      type: Boolean,
      default: true,
    },
    isDeleteSelected: {
      type: Boolean,
      default: true,
    },
    innerFormTemplate: {
      type: Object,
      default: {},
    },
    innerFormRules: {
      type: Object,
      default: {},
    },
    customDialog: {
      type: Boolean,
      default: false,
    },
    customFormName: {
      type: String,
      default: 'default',
    },
    customFormType: {
      type: String,
      default: '<table>',
    },
  },
  emits: ['afterAddRow'],

  setup(props, { emit }) {
    type AnyObject = {
      [key: string]: any;
    };
    type RowObject = {
      [key: string]: any;
    };
    const tableData = ref<Array<RowObject>>([...props.initialData]); // 表格数据
    const isEdit = ref(props.edit);
    const isDelete = ref(props.delete);
    const isAddBtn = ref(props.isAddBtn);
    const isDeleteSelected = ref(props.isDeleteSelected);
    const dialogVisible = ref(false); // 控制对话框显示
    const form = ref<AnyObject>(props.innerFormTemplate); // 表单数据
    const rules = ref(props.innerFormRules);
    const isEditing = ref(false); // 是否为编辑模式
    const currentIndex = ref(-1); // 当前编辑项索引
    const selectedRows = ref<Array<RowObject>>([]); // 存储选中的行数据
    const tableRef = ref(null); // 表格引用
    const innerForm = ref(null); //

    const customDialog = ref(props.customDialog);
    const customFormName = ref(props.customFormName);

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
      form.value = props.innerFormTemplate;
      isEditing.value = false;
      if (!customDialog.value) {
        dialogVisible.value = true;
      } else {
        openFormDialog({
          formType: props.customFormType,
          formName: props.customFormName,
        });
      }
    };

    // 编辑
    const handleEdit = (row: any) => {
      form.value = { ...props.innerFormTemplate,...row };
      currentIndex.value = tableData.value.indexOf(row);
      isEditing.value = true;
      if (!customDialog.value) {
        dialogVisible.value = true;
      }
    };

    // 删除单行
    const handleDelete = (row: any) => {
      ElMessageBox.confirm('确认删除这条记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          tableData.value = tableData.value.filter((item) => item !== row);
          ElMessage.success('删除成功');
        })
        .catch(() => {});
    };

    // 删除选中行
    const handleDeleteSelected = () => {
      ElMessageBox.confirm('确认删除选中的记录吗?', '提示', {
        type: 'warning',
      })
        .then(() => {
          tableData.value = tableData.value.filter(
            (item) => !selectedRows.value.includes(item)
          );
          selectedRows.value = []; // 清空已选
          ElMessage.success('删除成功');
        })
        .catch(() => {});
    };

    // 提交表单
    const handleSubmit = () => {
      if (isEditing.value) {
        // 更新数据
        updateValidate();
      } else {
        // 新增数据
        addValidate();
      }
      dialogVisible.value = false;
    };

    // 处理多选变更
    const handleSelectionChange = (rows: any) => {
      selectedRows.value = rows;
    };

    // 处理文本溢出
    const isTextOverflow = (content: string) => {
      if (!content) return false;
      else if (content.toString().length < 20) return false;
      else return true;
    };

    // 表格行样式
    const tableRowClassName = (arg: { row: any; rowIndex: number }) => {
      if (arg.rowIndex % 2 === 0) {
        return 'row-even';
      } else {
        return 'row-odd';
      }
    };

    // 搜索
    const handleSearch = (name: string) => {
      const filteredData = tableData.value.filter((item) => {
        return item.name.toLowerCase().includes(name);
      });
      tableData.value = filteredData;
    };

    //$bus
    $bus.on('Table:searchByTargetName', (name: string) => {
      handleSearch(name);
    });

    $bus.on('Table:add_row', () => {
      handleAdd();
    });

    $bus.on('Dialog->Table:addRow', (arg: any) => {
      // console.log('Dialog->Table:addRow:', arg);
      emit('afterAddRow', arg);
    });
    const addValidate = () => {
      if (!customDialog.value) {
        return innerForm.value.validate((valid) => {
          if (valid) {
            tableData.value.push({ ...form.value });
            ElMessage.success('新增成功');
            emit('afterAddRow', {
              formType: 'innerForm',
              formData: form.value,
            });
          } else {
            emit('afterAddRow', {
              formType: 'innerForm',
              formData: null,
            });
            ElMessage.error('请填写完整信息');
            return false;
          }
        });
      }
    };

    const updateValidate = () => {
      if (!customDialog.value) {
        return innerForm.value.validate((valid) => {
          if (valid) {
            tableData.value[currentIndex.value] = { ...form.value };
            ElMessage.success('编辑成功');
          } else {
            ElMessage.error('请填写完整信息');
            return false;
          }
        });
      } else {
      }
    };
    // watch(
    //   () => innerForm.value,
    //   (newValue) => {
    //     console.log('innerForm.value:', newValue);
    //   }
    // );

    // onMounted(() => {
    //   console.log('Table:mounted:', props.innerFormTemplate, form.value);
    // });
    // onBeforeUnmount(() => {
    //   console.log('Table:unmounted');
    // })
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
      isTextOverflow,
      tableRowClassName,
      isEdit,
      isDelete,
      isAddBtn,
      isDeleteSelected,
      innerForm,
      rules,
    };
  },
});
</script>

<style lang="scss" scoped>
.enhanced-table {
  @include default-enhanced-table;
}
</style>
