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
        :formName="formName"
        :formType="formType"
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
const formType = ref('DialogForm' + Date.now());
const formData = ref({});
$bus.on('EditDialog:SlotForm:open', (arg: any) => {
  openDialog();
  description.value = arg.description;
  formData.value = arg.formData;
  formName.value = arg.formName;
  formType.value = arg.formType;
  
});

$bus.on('EditDialog:SlotForm:close', (arg: any) => {
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
  formName.value = myFormRef.value.getFormInfo().name;
  formType.value = myFormRef.value.getFormInfo().type;
  if (status == 'submit:success') {
    closeDialog();
    // console.log('submitedForm:', formData.value, formName.value, formType.value);
    $bus.emit('$:Dialog->Tree:addNode', {
      formData: formData.value,
      formName: formName.value,
      formType: formType.value,
    });
  }
}

// 表单提交成功回调
function onFormSubmitted() {}

// 关闭时重置表单
async function resetForm() {}
</script>
