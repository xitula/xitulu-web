<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTechStackStore } from '@/stores/tech-stack'

const store = useTechStackStore()
const { currentList } = storeToRefs(store)
</script>

<template>
  <el-table id="list-table" :data="currentList">
    <el-table-column prop="name" label="技术名称" />
    <el-table-column prop="link" label="官方链接" width="500px" />
  </el-table>
</template>

<style scoped>
#list-table {
  min-width: 100%;
}
:deep(.cell) {
  white-space: nowrap;
}
</style>
