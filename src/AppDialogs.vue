<template>
  <div class="app-dialogs">
    <!-- <DialogAddSysToTree /> -->
    <EditDialogSlotForm />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//@ts-ignore
import DialogAddSysToTree from './components/Dialog/example/addSysToTree.vue';
//@ts-ignore
import EditDialogSlotForm from '@/components/Dialog/forms/SlotForm.vue';
</script>

<style scoped></style>
