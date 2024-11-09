<template>
  <div class="enhanced-form">
    <el-form
      :model="formData"
      ref="formRef"
      :rules="computedRules"
      label-width="100px"
    >
      <!-- 进度条 -->
      <el-progress :percentage="formProgress" v-if="showProgress" />

      <!-- 多步表单步骤显示 -->
      <el-steps
        v-if="steps.length > 1"
        :active="currentStep"
        finish-status="success"
      >
        <el-step
          v-for="(step, index) in steps"
          :key="index"
          :title="step.title"
        ></el-step>
      </el-steps>

      <!-- 可拖拽的动态表单字段 -->
      <vue-draggable-next
        v-if="drag"
        v-model="currentStepFields"
        handle=".drag-handle"
        animation="200"
      >
        <el-row :gutter="20">
          <el-col
            v-for="item in currentStepFields"
            :key="item.field"
            :span="item.span"
          >
            <el-form-item
              :label="item.label"
              :prop="item.field"
              :rules="getFieldRules(item)"
            >
              <component
                :is="getComponentType(item.type)"
                v-model="formData[item.field]"
                v-bind="getFieldProps(item)"
                :disabled="!checkPermission(item)"
                @input="onFieldInput(item)"
              />
              <el-tooltip
                v-if="item.tooltip"
                effect="dark"
                :content="item.tooltip"
                placement="top"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
              <div class="drag-handle" style="cursor: move">拖动</div>
            </el-form-item>
          </el-col>
        </el-row>
      </vue-draggable-next>
      <!-- 或者 -->
      <!-- 动态表单字段 -->
      <el-row v-else :gutter="20">
        <el-col
          v-for="item in currentStepFields"
          :span="item.span"
          :key="item.field"
        >
          <el-form-item
            :label="item.label"
            :prop="item.field"
            :rules="getFieldRules(item)"
          >
            <component
              :is="getComponentType(item.type)"
              v-model="formData[item.field]"
              v-bind="getFieldProps(item)"
              :disabled="!checkPermission(item)"
              @input="onFieldInput(item)"
            />
            <el-tooltip
              v-if="item.tooltip"
              effect="dark"
              :content="item.tooltip"
              placement="top"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 动态字段克隆 -->
      <el-row v-for="(group, index) in cloneableFields" :key="index">
        <el-form-item label="姓名">
          <el-input v-model="group.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="group.email"></el-input>
        </el-form-item>
        <el-button @click="addFieldGroup" type="primary">添加联系人</el-button>
        <el-button @click="removeFieldGroup(index)" type="danger"
          >删除</el-button
        >
      </el-row>

      <!-- 多步表单导航按钮 -->
      <div v-if="steps.length > 1" class="steps-btns">
        <el-button @click="previousStep" v-if="currentStep > 0"
          >上一步</el-button
        >
        <el-button @click="nextStep" v-if="currentStep < steps.length - 1"
          >下一步</el-button
        >
      </div>

      <!-- 默认操作按钮，支持自定义 -->
      <template v-if="!$slots.footer">
        <el-row>
          <el-col :span="24" class="form-actions-col">
            <div class="operations">
              <el-button @click="resetForm">重置</el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="confirmSubmit"
                >提交</el-button
              >
              <el-button @click="exportToCSV" type="info">导出数据</el-button>
              <el-upload
                class="upload-demo"
                action=""
                :auto-upload="false"
                :on-change="onFileChange"
              >
                <el-button type="primary">导入数据</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </template>

      <slot name="footer"></slot>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { VueDraggableNext } from 'vue-draggable-next';

const props = defineProps({
  description: { type: Array<any>, required: true },
  initialData: { type: Object, default: () => ({}) },
  submit: { type: Function, required: true },
  steps: { type: Array<any>, default: () => [] },
  showProgress: { type: Boolean, default: false },
  userRole: { type: String, default: 'user' },
  customComponents: { type: Object, default: () => ({}) },
  drag: { type: Boolean, default: false },
});

const emit = defineEmits(['submit', 'reset', 'validationFailed']);

const formRef = ref();
const loading = ref(false);
const formData = reactive<any>({});
const currentStep = ref(0);
const cloneableFields = reactive([{ name: '', email: '' }]);
const computedRules = ref({});
const steps = ref(props.steps);
const drag = ref(props.drag);

// 初始化表单数据
const initializeData = () => {
  props.description.forEach(
    (item) => (formData[item.field] = props.initialData[item.field] || '')
  );
};
initializeData();

const resetForm = () => {
  // 重置表单的验证状态
  formRef.value?.resetFields();

  // 重新初始化表单数据
  initializeData(); // 调用之前定义的 initializeData 方法，将 formData 重置为初始值
};

// 当前步骤的字段
const currentStepFields = computed(() => {
  const stepFields =
    props.steps.length > 1
      ? props.steps[currentStep.value].fields
      : props.description.map((item) => item.field);
  return props.description.filter((item) => stepFields.includes(item.field));
});

// 表单进度计算
const formProgress = computed(() => {
  const filledFields = Object.values(formData).filter(
    (value) => value !== ''
  ).length;
  return Math.round((filledFields / props.description.length) * 100);
});

//克隆字段
const addFieldGroup = () => {
  cloneableFields.push({ name: '', email: '' });
};

const removeFieldGroup = (index: number) => {
  cloneableFields.splice(index, 1);
};

// 检查权限
const checkPermission = (item: { roles: string | string[] }) =>
  !item.roles || item.roles.includes(props.userRole);

// 动态获取字段组件
const formCompMap: any = {
  input: 'el-input',
  select: 'el-select',
  checkbox: 'el-checkbox-group',
  date: 'el-date-picker',
  switch: 'el-switch',
};
const getComponentType = (type: string | number) => {
  return props.customComponents[type] || formCompMap[type] || 'el-input';
};

// 获取字段的属性
const getFieldProps = (item: {
  placeholder: any;
  options: any;
  formatter: any;
}) => {
  const props: any = { placeholder: item.placeholder || '' };
  if (item.options) props['options'] = item.options;
  if (item.formatter) props['valueFormat'] = item.formatter;
  return props;
};

// 获取字段规则
const getFieldRules = (item: { rules: any; dynamicRules: any }) => {
  if (item.rules)
    return typeof item.rules === 'function' ? item.rules(formData) : item.rules;
  return item.dynamicRules ? item.dynamicRules.getRules(formData) : [];
};

// 动态验证字段
const onFieldInput = (item: { dynamicRules: any; field: any }) => {
  if (item.dynamicRules) formRef.value.validateField(item.field);
};

// 表单动态联动和自动填充
const autoFillFields = () => {
  props.description.forEach((item) => {
    if (item.autoFill) {
      watch(
        () =>
          item.autoFill.dependencies.map(
            (dep: string | number) => formData[dep]
          ),
        () => (formData[item.field] = item.autoFill.computeValue(formData))
      );
    }
  });
};
onMounted(autoFillFields);

// 导出表单数据
const exportToCSV = () => {
  const csvContent = Object.keys(formData)
    .map((key) => `${key},${formData[key]}`)
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'formData.csv');
  link.click();
};

// 从 CSV 文件导入数据
const onFileChange = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const res = e.target?.result?.toString();
    if (!res) return;
    const lines = res?.split('\n');
    lines.forEach((line: any) => {
      const [key, value] = line.split(',');
      if (formData[key] !== undefined) formData[key] = value;
    });
  };
  reader.readAsText(file);
};

// 草稿保存和恢复
const saveDraft = (version = 'default') => {
  const drafts = JSON.parse(localStorage.getItem('formDrafts') || '{}');
  drafts[version] = formData;
  localStorage.setItem('formDrafts', JSON.stringify(drafts));
};

const loadDraft = (version = 'default') => {
  const drafts = JSON.parse(localStorage.getItem('formDrafts') || '{}');
  if (drafts[version]) Object.assign(formData, drafts[version]);
};

watch(formData, () => saveDraft(), { deep: true });
onMounted(() => loadDraft());

// 表单步骤控制
const getNextStep = () =>
  props.steps.length > currentStep.value + 1
    ? currentStep.value + 1
    : currentStep.value;
const nextStep = () => (currentStep.value = getNextStep());
const previousStep = () => currentStep.value--;

// 提交前的确认
const confirmSubmit = () => {
  ElMessageBox.confirm('确认提交表单吗？', '提交确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => handleSubmit())
    .catch(() => {});
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  try {
    await formRef.value.validate();
    await props.submit(formData);
    ElMessage.success('提交成功');
    emit('submit', formData);
  } catch (error: any) {
    scrollToFirstError(Object.keys(error));
    emit('validationFailed', error);
  } finally {
    loading.value = false;
  }
};

const scrollToFirstError = (errorFields: any[]) => {
  const firstErrorField = errorFields[0];
  const errorElement = formRef.value.$el.querySelector(
    `[prop="${firstErrorField}"]`
  );
  if (errorElement) {
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    errorElement.classList.add('error-highlight');
    setTimeout(() => errorElement.classList.remove('error-highlight'), 2000);
  }
};
</script>

<style lang="scss" scoped>
.operations {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 20px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.drag-handle {
  cursor: move;
  font-size: 12px;
  color: #909399;
  text-align: right;
}

.error-highlight {
  border: 2px solid red;
  animation: shake 0.2s;
}
</style>
