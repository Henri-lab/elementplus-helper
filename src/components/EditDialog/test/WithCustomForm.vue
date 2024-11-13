<template>
  <div class="test-edit-dialog-form">
    <el-button @click="handleClick">open dialog with form to edit!</el-button>
    <!-- <el-button @click="close"> close dialog with form!</el-button> -->
  </div>
</template>
<script setup>
import { onMounted, watch } from 'vue';
import $bus from '@/utils/bus';
import { des1, open } from '../forms/config';

const handleClick = () => {
  open(des1, 'from ~ src/components/EditDialog/test/WithCustomForm.vue');
};
</script>
