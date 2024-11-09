<template>
    <el-form :model="formData" ref="formRef">
        <el-row :gutter="20">
            <el-col v-for="item in description" :span="item.span" :key="item.field">
                <el-form-item :label="item.label" :prop="item.field" :rules="item.rules">
                    <component :is="getComponentType(item.type)" v-model="formData[item.field]"
                        v-bind="getFieldProps(item)" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { reactive } from 'vue';

const formRef = ref(null);
const props = defineProps({
    description: {
        type: Array,
        default: [
            {
                label: '用户名',
                field: 'username',
                span: 12, // 表单字段占用的栅格宽度
                type: 'input', // 表单类型：可以是 'input', 'select', 'checkbox', 'radio', 等
                placeholder: '请输入用户名',
                rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
            },
            {
                label: '邮箱',
                field: 'email',
                span: 12,
                type: 'input',
                placeholder: '请输入邮箱地址',
                rules: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
                ],
            },
            {
                label: '性别',
                field: 'gender',
                span: 24,
                type: 'select', // 表单类型为下拉选择框
                placeholder: '请选择性别',
                options: [
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                    { label: '其他', value: 'other' },
                ],
                rules: [{ required: true, message: '请选择性别', trigger: 'change' }],
            },
            {
                label: '爱好',
                field: 'hobbies',
                span: 24,
                type: 'checkbox', // 多选框
                options: [
                    { label: '阅读', value: 'reading' },
                    { label: '旅行', value: 'traveling' },
                    { label: '运动', value: 'sports' },
                ],
                rules: [{ required: true, message: '请选择至少一个爱好', trigger: 'change' }],
            },
            {
                label: '个人简介',
                field: 'bio',
                span: 24,
                type: 'textarea',
                placeholder: '请输入个人简介',
                rules: [{ required: true, message: '个人简介不能为空', trigger: 'blur' }],
            },
            {
                label: '生日',
                field: 'birthdate',
                span: 12,
                type: 'date-picker',
                placeholder: '请选择生日',
                rules: [{ required: true, message: '请选择生日', trigger: 'change' }],
            },
            {
                label: '城市',
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
        ],
    },
})
const description = props.description
const formData = reactive({});
description.forEach((item) => {
    formData[item.field] = '';
});

// 根据表单项类型返回对应的组件
const getComponentType = (type) => {
    switch (type) {
        case 'input': return 'el-input';
        case 'textarea': return 'el-input';
        case 'select': return 'el-select';
        case 'checkbox': return 'el-checkbox-group';
        case 'date-picker': return 'el-date-picker';
        default: return 'el-input';
    }
};

// 获取组件的属性
const getFieldProps = (item) => {
    if (item.type === 'select' || item.type === 'checkbox') {
        return { options: item.options };
    }
    return { placeholder: item.placeholder };
};


const emit=defineEmits(['submit']);

const submitForm = () => {
  
};
</script>