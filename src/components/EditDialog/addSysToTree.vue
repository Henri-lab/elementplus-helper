<template>
  <!-- 自定义表单弹窗 -->
  <EditDialog
    v-model:visible="dialogVisible"
    title="新建目标体系"
    :onSubmit="handleFormSubmit"
    @submitted="onFormSubmitted"
    @closed="resetForm"
  >
    <template #form>
      <Form ref="formRef" :description="description"></Form>
    </template>
  </EditDialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import EditDialog from './index.vue';
import Form from '@/components/Form/index.vue';
import $bus from '@/utils/bus';

// 打开弹窗
function openDialog() {
  dialogVisible.value = true;
}
// 关闭弹窗
function closeDialog() {
  dialogVisible.value = false;
}
$bus.on('Dialog:addSysToTree:open', () => {
  openDialog();
});

$bus.on('Dialog:addSysToTree:close', () => {
  closeDialog();
});

const dialogVisible = ref(false);
const formRef = ref(null);
const formData = ref({
  username: '',
  email: '',
});

const description = [
  {
    label: '目标体系',
    field: 'city',
    span: 12,
    type: 'select',
    placeholder: '请选择城市',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
    ],
  },
  {
    label: '备注',
    field: 'note',
    span: 24, // 表单字段占用的栅格宽度
    type: 'textarea', // 表单类型：可以是 'input', 'select', 'checkbox', 'radio', 等
    placeholder: '请输入备注',
    style: {
      width: '500px',
      height: '200px',
      position: 'absolute',
      top: '10%',
      left: '3.7%',
    },
  },
];

// 提交表单
async function handleFormSubmit() {
  await formRef.value.validate();
  // 假设这是一个异步请求
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('表单提交数据:', formData.value);
}

// 表单提交成功回调
function onFormSubmitted() {
  ElMessage.success('表单提交成功');
}

// 关闭时重置表单
function resetForm() {}
</script>
