<template>
  <el-form :model="formData" ref="elFormRef" @click="testFormInfo">
    <el-row :gutter="20">
      <el-col v-for="item in description" :span="item.span" :key="item.field">
        <el-form-item
          :label="item.label"
          :prop="item.field"
          :rules="item.rules"
        >
          <div style="display: inline-block; width: 100%">
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
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { def_description } from './default';
import type { IDescriptionItem, IDescriptionInfoItem } from './interface';
import { getDescriptionByName, getDescriptionFields } from './tool';
//@ts-ignore
import { filterObjectProperties } from '@/utils/tool';
//@ts-ignore
import $bus from '@/utils/bus';

$bus.on('Form:Get:FormDataRef', () => {
  $bus.emit('$:Public:formDataRef', {
    formData,
    formName: props.formName,
    formType: props.formType,
  });
});

const elFormRef = ref<FormInstance | null>(null);
const props = defineProps({
  description: {
    type: Array<IDescriptionItem>,
    default: () => def_description,
  },
  formName: {
    type: String,
    default: 'default',
  },
  formType: {
    type: String,
    default: 'default',
  },
});
const emits = defineEmits(['submit']);

let description = reactive(props.description);
const formType = ref(props.formType);
const formName = ref(props.formName);

// 初始化 `formData` 对象，用 `field` 作为键
let formData = reactive<any>({}); //内部数据绑定
let copyFormData = {}; //传递数据绑定，只保留指定属性
const createOrUpdateFormDataByDescription = (
  description: IDescriptionItem[]
) => {
  copyFormData = formData;
  console.log(description,'--======');
  
  description.forEach((item: IDescriptionItem) => {
    formData[item.field] = item.type === 'checkbox' ? [] : item.data || ''; // 为每个字段设置初始值
    copyFormData[item.field] = item.type === 'checkbox' ? [] : item.data || ''; // 为每个字段设置初始值
  });
  return copyFormData;
};
createOrUpdateFormDataByDescription(description);

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

const testFormInfo = () => {
  console.log(
    `%cformType:${props.formType};formName:${props.formName}`,
    `color:wheat;background-color:black;border:1px solid orange;`
  );
};

watch(
  () => formName,
  () => {
    description = getDescriptionByName(formName.value);
    let exportedFormData = createOrUpdateFormDataByDescription(description);
    let fields = getDescriptionFields(description);
    filterObjectProperties(copyFormData, fields);
    console.log('formName changed! is', formName.value);
    // console.log('description changed! is', description);
    // console.log('fields changed! is', fields);
    // console.log('exportedFormData changed! is', exportedFormData);
    // console.log('form inner data',formData);
  },
  {
    immediate: true,
  }
);

// 获取组件的属性
const getFieldProps = (item: IDescriptionItem) => {
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

const status = ref<string>('default');
async function openValidate(overwrite: boolean) {
  if (!elFormRef.value) return;
  if (!overwrite) {
    //不覆盖默认验证logic
    return new Promise<{ validate: () => void; status: string }>((resolve) => {
      const validCallBack = (valid: boolean) => {
        if (valid) {
          ElMessage.success('验证成功，已提交');
          status.value = 'submit:success';
        } else {
          status.value = 'submit:failure';
          ElMessage.error('验证失败，请检查输入');
        }
        // 在验证回调完成后返回结果
        resolve({
          validate: elFormRef.value!.validate,
          status: status.value,
        });
      };
      //在异步代码执行时，例如在调用 validate 方法之前，elFormRef.value可能被改变
      if (elFormRef.value) {
        elFormRef.value.validate(validCallBack);
      } else {
        console.error('can not validate of form!');
      }
    });
  }
  // 如果 overwrite 为 true，可以直接返回当前的 validate 方法和 status
  return {
    validate: elFormRef.value.validate,
    status: status.value,
  };
}

function getStatus() {
  return status.value;
}
function getResetFields() {
  if (!elFormRef.value) return;
  return elFormRef.value.resetFields;
}

function getFormInfo() {
  return {
    name: formName.value,
    type: formType.value,
  };
}

defineExpose({
  getFormData,
  openValidate,
  getResetFields,
  getStatus,
  getFormInfo,
});
</script>
