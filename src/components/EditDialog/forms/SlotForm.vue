<template>
  <!-- 自定义表单弹窗 -->
  <EditDialog
    v-model:visible="dialogVisible"
    title="编辑用户信息"
    submitButtonText="提交"
    cancelButtonText="取消"
    :onSubmit="handleFormSubmit"
    @submitted="onFormSubmitted"
    @closed="resetForm"
    :autoClose="false"
  >
    <template #form>
      <MyCoustomForm
        :description="description"
        :name="formName"
        ref="myFormRef"
      ></MyCoustomForm>
    </template>
  </EditDialog>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
//@ts-ignore
import $bus from '@/utils/bus';
//@ts-ignore
import EditDialog from '../index.vue';
//@ts-ignore
import MyCoustomForm from '@/components/Form/index.vue';
//@ts-ignore
import { sleep } from '@/utils/tool';

const description = ref(null);
const formName = ref('DialogForm' + Date.now());

const formData = ref({});
$bus.on('EditDialog:SlotForm:open', (arg: any) => {
  console.log('$bus@EditDialog:SlotForm:open', arg);
  openDialog();
  description.value = arg.description;
  formName.value = arg.formName;
});

$bus.on('EditDialog:SlotForm:close', (arg: any) => {
  console.log('$bus@EditDialog:SlotForm:close', arg);
  closeDialog();
});

const dialogVisible = ref(false);
const myFormRef = ref<any>(null);

// 打开弹窗
function openDialog() {
  dialogVisible.value = true;
}

// 关闭弹窗
function closeDialog() {
  dialogVisible.value = false;
}

// 提交表单
async function handleFormSubmit() {
  const overwrite = false;
  const { status } = await myFormRef.value.openValidate(overwrite);
  formData.value = myFormRef.value.getFormData();
  if (status == 'submit:success') {
    closeDialog();
    console.log('formData:', formData.value);
    $bus.emit('$:Dialog->Tree:addNode', formData.value);
  }
}

// 表单提交成功回调
function onFormSubmitted() {
  
}

// 关闭时重置表单
async function resetForm() {}
</script>
