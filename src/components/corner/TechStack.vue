<script setup lang="ts">
import { useTechStackStore } from '../../stores/tech-stack'
const techStackStore = useTechStackStore()

/**
 * 切换技术栈列表展示状态
 */
function toggleListStatus(): void {
  techStackStore.techStackListShow = !techStackStore.techStackListShow
}
</script>

<template>
  <div class="flex flex-col items-end text-[2rem] text-main-color">
    <el-icon class="text-[2rem] cursor-pointer" @click="toggleListStatus"><Tickets /></el-icon>
  </div>
</template>
