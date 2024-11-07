<template>
    <el-dialog :model-value="visible" :title="title" width="50%" @close="handleClose">
        <div class="dialog-content">
            <slot name="form" />
        </div>

        <!-- 操作按钮 -->
        <template #footer>
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :loading="loading" @click="handleSubmit">
                {{ submitButtonText }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '编辑',
    },
    submitButtonText: {
        type: String,
        default: '保存',
    },
    onSubmit: {
        type: Function,
        required: true,
    },
    resetOnClose: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:visible', 'submitted', 'closed']);
const loading = ref(false);

// 关闭弹窗
function closeDialog() {
    emit('update:visible', false);
}

// 弹窗关闭时重置表单
function handleClose() {
    if (props.resetOnClose) {
        emit('closed');
    }
    closeDialog();
}

// 提交表单
async function handleSubmit() {
    loading.value = true;
    try {
        await props.onSubmit();
        emit('submitted'); // 表单提交成功事件
        closeDialog();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

// 监听 visible 的变化
watch(
    () => props.visible,
    (newVal) => {
        if (!newVal && props.resetOnClose) {
            emit('closed');
        }
    }
);
</script>

<style scoped>
.dialog-content {
    padding: 20px;
}
</style>