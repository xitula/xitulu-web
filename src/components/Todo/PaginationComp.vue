<script setup lang="ts">
import { toRefs } from 'vue'
import { useTodoStore } from '../../stores/todo'

const todoStore = useTodoStore()
const { currentPage, pageSize, total } = toRefs(todoStore)
const { handleCurrentPageChange } = todoStore
</script>

<template>
  <div
    class="flex grow-0 shrink-0 justify-center items-center w-full h-12 overflow-hidden border-t border-[--main-color]"
  >
    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="currentPage"
      :total="total"
      :page-size="pageSize"
      layout="prev, pager, next"
      @current-change="handleCurrentPageChange"
    />
  </div>
</template>
