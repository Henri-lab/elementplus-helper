<template>
  <div class="test-edit-dialog-form">
    <el-button @click="handleClick">open dialog with form to edit!</el-button>
    <!-- <el-button @click="close"> close dialog with form!</el-button> -->
  </div>
</template>
<script setup>
import { onMounted, watch } from 'vue';
import $bus from '@/utils/bus';
import { description_addNewSysForm, open } from '../forms/config';

const handleClick = () => {
  open(description_addNewSysForm, 'from ~ src/components/EditDialog/test/WithCustomForm.vue');
};
</script>
