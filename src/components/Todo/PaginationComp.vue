<script setup lang="ts">
import { toRefs } from 'vue'
import { useTodoStore } from '../../stores/todo'

const todoStore = useTodoStore()
const { currentPage, pageSize, total } = toRefs(todoStore)
const { handleCurrentPageChange } = todoStore
</script>

<template>
  <div id="pagination" class="flex">
    <el-pagination
      v-model:current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      layout="prev, pager, next"
      @current-change="handleCurrentPageChange"
    />
  </div>
</template>

<style scoped>
#pagination {
  width: 100%;
  height: 3rem;
  border-top: 1px solid var(--main-color);
}
</style>
