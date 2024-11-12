<template>
  <A2M>
    <template #a1>
      <div>
        <Tree/>
      </div>
    </template>
    <template #a2>
      <div>
        <Tree/>
      </div>
    </template>
    <template #a3>
      <div>
       <DragBox/>
      </div>
    </template>
    <template #m>
      <div>
        <TreeOrg/>
      </div>
    </template>
  </A2M>
</template>

<script setup>
import { ref, watch } from 'vue';
import A2M from '@/layout/template/A2_M.vue';
import TreeOrg from '@/components/Tree/TreeOrg.vue';
import Tree from '@/components/Tree/index.vue';
import Table from '@/components/Form/index.vue';
import DragBox from '@/components/Draggable/demo1.vue'
</script>

<style lang="scss" scoped></style>
