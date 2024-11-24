<template>
  <div>
    <el-form>
      <el-form-item label="表单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入表单名称"></el-input>
      </el-form-item>
      <el-form-item label="表单描述" prop="description">
        <el-input
          v-model="form.description"
          placeholder="请输入表单描述"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const form = reactive({
  name: '',
  description: '',
});

const onSubmit = () => {
  // 提交表单数据
  console.log(form);
};
</script>

<style lang="scss" scoped></style>
