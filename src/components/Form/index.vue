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

<script setup>
import { onMounted, reactive } from 'vue';
import { def_description } from './default';

const elFormRef = ref(null);
const props = defineProps({
  description: {
    type: Array,
    default: () => def_description,
  },
});

const description = reactive(props.description);

// 初始化 `formData` 对象，用 `field` 作为键
const formData = reactive({});
description.forEach((item) => {
  formData[item.field] = item.type === 'checkbox' ? [] : item.data || ''; // 为每个字段设置初始值
});
// 根据表单项类型返回对应的组件
const getComponentType = (type) => {
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
const getFieldProps = (item) => {
  const props = { placeholder: item.placeholder };
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
function getValidate(){
  return elFormRef.value.validate;
}

function getResetFields(){
  return elFormRef.value.resetFields;
}


defineExpose({
  getFormData,
  getValidate,
  getResetFields,
});
</script>
