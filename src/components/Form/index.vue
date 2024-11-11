<template>
  <el-form :model="formData" ref="elFormRef">
    <el-row :gutter="20">
      <el-col v-for="item in description" :span="item.span" :key="item.field">
        <el-form-item
          :label="item.label"
          :prop="item.field"
          :rules="item.rules"
        >
          <component
            :is="getComponentType(item.type)"
            v-model="formData[item.field]"
            v-bind="getFieldProps(item)"
            v-bind:style="item.style"
          >
            <!-- 渲染 el-select 的选项 -->
            <template v-if="item.type === 'select'">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </template>

            <!-- 渲染 el-checkbox-group 的选项 -->
            <template v-if="item.type === 'checkbox'">
              <el-checkbox
                v-for="option in item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </template>
          </component>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { def_description } from './default';

type DescriptionItem = {
  label: string;
  field: string;
  span: number;
  type: string;
  placeholder?: string;
  style?: Record<string, string>;
  data?: any;
  rules?: Array<any>;
  options?: Array<any>;
};
const elFormRef = ref<FormInstance | null>(null);
const props = defineProps({
  description: {
    type: Array<DescriptionItem>,
    default: () => def_description,
  },
});

const description = reactive(props.description);

// 初始化 `formData` 对象，用 `field` 作为键
const formData = reactive<any>({});
description.forEach((item: DescriptionItem) => {
  formData[item.field] = item.type === 'checkbox' ? [] : item.data || ''; // 为每个字段设置初始值
});
// 根据表单项类型返回对应的组件
const getComponentType = (type: string) => {
  switch (type) {
    case 'input':
      return 'el-input';
    case 'textarea':
      return 'el-input';
    case 'select':
      return 'el-select';
    case 'checkbox':
      return 'el-checkbox-group';
    case 'date-picker':
      return 'el-date-picker';
    default:
      return 'el-input';
  }
};

// 获取组件的属性
const getFieldProps = (item: DescriptionItem) => {
  const props: any = { placeholder: item.placeholder };
  if (item.type === 'date-picker') {
    props.type = 'date';
    props.format = 'YYYY-MM-DD';
    props['value-format'] = 'YYYY-MM-DD';
  }
  return props;
};

function getFormData() {
  return formData;
}
function openValidate(overwrite: boolean) {
  if (!elFormRef.value) return;
  if (!overwrite) {
    // 不覆盖默认的 validation logic
    const validCallBack = (valid: boolean) => {
      if (valid) {
        console.log('验证成功，提交表单数据:', formData.value);
        ElMessage.success('验证成功，已提交');
      } else {
        console.log('验证失败，检查输入');
        ElMessage.error('验证失败，请检查输入');
      }
    };
    elFormRef.value.validate(validCallBack);
  }
  return elFormRef.value.validate;
}

function getResetFields() {
  if (!elFormRef.value) return;
  return elFormRef.value.resetFields;
}

defineExpose({
  getFormData,
  openValidate,
  getResetFields,
});
</script>
