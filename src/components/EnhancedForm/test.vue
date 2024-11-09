<template>
  <div class="test demo" style="background-color:gray">
    <EnhancedForm
      :description="description"
      :initialData="initialData"
      :steps="steps"
      :showProgress="true"
      :submit="handleSubmit"
      userRole="user"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EnhancedForm from './index.vue';

// 表单字段描述
const description = [
  {
    label: '用户名',
    field: 'username',
    type: 'input',
    span: 12,
    placeholder: '请输入用户名',
    rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  },
  {
    label: '邮箱',
    field: 'email',
    type: 'input',
    span: 12,
    placeholder: '请输入邮箱',
    rules: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    ],
  },
  {
    label: '年龄',
    field: 'age',
    type: 'input',
    span: 6,
    placeholder: '请输入年龄',
    rules: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
    dynamicRules: {
      getRules: (data) =>
        data.age < 18
          ? [{ type: 'number', min: 18, message: '年龄应大于或等于18' }]
          : [],
    },
  },
  {
    label: '国家',
    field: 'country',
    type: 'select',
    span: 6,
    options: [
      { label: '美国', value: 'USA' },
      { label: '加拿大', value: 'Canada' },
    ],
    placeholder: '请选择国家',
  },
  {
    label: '省份',
    field: 'province',
    type: 'select',
    span: 6,
    options: [],
    placeholder: '请选择省份',
    autoFill: {
      dependencies: ['country'],
      computeValue: (data) =>
        data.country === 'USA'
          ? [
              { label: '加州', value: 'CA' },
              { label: '德州', value: 'TX' },
            ]
          : [
              { label: '安大略', value: 'ON' },
              { label: '魁北克', value: 'QC' },
            ],
    },
  },
  {
    label: '个人简介',
    field: 'bio',
    type: 'textarea',
    span: 24,
    placeholder: '请输入个人简介',
  },
];

// 初始数据
const initialData = {
  username: '',
  email: '',
  age: '',
  country: '',
  province: '',
  bio: '',
};

// 多步骤表单配置
const steps = [
  { title: '基本信息', fields: ['username', 'email'] },
  { title: '更多信息', fields: ['age', 'country', 'province'] },
  { title: '个人简介', fields: ['bio'] },
];

// 表单提交处理函数
const handleSubmit = async (formData) => {
  console.log('提交的数据:', formData);
  alert('表单提交成功');
};
</script>
