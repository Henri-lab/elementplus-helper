<template>
  <!-- 自定义表单弹窗 -->
  <EditDialog
    v-model:visible="dialogVisible"
    title="新建目标体系"
    submitButtonText="提交"
    cancelButtonText="取消"
    :onSubmit="handleFormSubmit"
    @submitted="onFormSubmitted"
    @closed="resetForm"
    :autoClose="false"
  >
    <template #form>
      <MyForm ref="myFormRef" :description="description"></MyForm>
    </template>
  </EditDialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import EditDialog from '../index.vue';
import MyForm from '@/components/Form/index.vue';
import $bus from '@/utils/bus';
const emits = defineEmits();
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
const myFormRef = ref(null);
const formData = ref({
  username: '',
  email: '',
});

onMounted(() => {
  console.log('addSysToTreeDialog mounted');
});

// 缓存表单数据
const cacheFormData = computed(() => formData.value);

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
    span: 24,
    type: 'textarea',
    placeholder: '请输入备注',
    style: {
      width: '94%',
      height: '100%',
      position: 'absolute',
      top: '10%',
      left: '3.7%',
    },
    rules: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
  },
];

// 提交表单
let submitStatus = false;
async function handleFormSubmit() {
  const overwrite = false;
  const { status } = await myFormRef.value.openValidate(overwrite);
  // console.log('form status:', status);
  formData.value = myFormRef.value.getFormData();
  if (status == 'submit:success') {
    closeDialog();
  }
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // 假设这是一个异步请求
}

// 表单提交成功回调
function onFormSubmitted() {
  // console.log('afterGoodSubmit:', 'cacheFormData:', cacheFormData.value);
}

// 关闭时重置表单
function resetForm() {
  const reset = myFormRef.value.getResetFields();
  reset();
}
</script>
