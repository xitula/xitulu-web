<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTechStackStore } from '../../stores/tech-stack'

const store = useTechStackStore()
const { currentList } = storeToRefs(store)
</script>

<template>
  <div class="min-w-full border border-main-color bg-main-background-color">
    <el-table :data="currentList" v-if="store.techStackListShow">
      <el-table-column prop="name" label="技术名称" />
      <el-table-column prop="link" label="官方链接" width="500px" />
    </el-table>
  </div>
</template>

<style scoped>
:deep(.cell) {
  @apply whitespace-nowrap;
}
:deep(.el-table__row:last-child) {
  --el-table-border: 0;
}
</style>
