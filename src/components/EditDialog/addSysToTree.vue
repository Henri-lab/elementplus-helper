<template>
  <el-button @click="openDialog">编辑数据</el-button>

  <!-- 自定义表单弹窗 -->
  <EditDialog
    v-model:visible="dialogVisible"
    title="编辑用户信息"
    :onSubmit="handleFormSubmit"
    @submitted="onFormSubmitted"
    @closed="resetForm"
  >
    <template #form>
      <Form></Form>
    </template>
  </EditDialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import EditDialog from './index.vue';
import Form from '@/components/Form/index.vue';
import $bus from '@/utils/bus';

$bus.on('Dialog:addSysToTree:open', () => {
  dialogVisible.value = true;
});

$bus.on('Dialog:addSysToTree:close', () => {
  dialogVisible.value = false;
});

const dialogVisible = ref(false);
const formRef = ref(null);
const formData = ref({
  username: '',
  email: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
};

// 打开弹窗
function openDialog() {
  dialogVisible.value = true;
}

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
function resetForm() {
  formRef.value.resetFields();
}
</script>
