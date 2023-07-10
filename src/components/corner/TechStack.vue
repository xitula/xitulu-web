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
  <div id="btn-tech-stack">
    <el-icon id="icon" @click="toggleListStatus"><Tickets /></el-icon>
  </div>
</template>

<style>
#btn-tech-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 2rem;
  color: var(--color-main-contant);
}

#icon {
  font-size: 2rem;
  cursor: pointer;
}
</style>
