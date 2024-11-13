<template>
  <div class="targetSys-main-views">
    <BasFeaTheme class="view1" v-if="true" />
    <TreeOrg class="view2" v-else />
  </div>
</template>

<script setup>
import BasFeaTheme from '@/components/Tabs/example/Bas&Fea&Theme.vue';
import TreeOrg from '@/components/TreeOrg/TreeOrg.vue';
</script>

<style lang="scss" scoped></style>
