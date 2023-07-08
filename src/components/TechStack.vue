<script setup lang="ts">
import { ref } from 'vue'
import TechStackList from './TechStackList.vue'

// 技术栈列表状态
const listStatus = ref<boolean>(false)

/**
 * 切换技术栈列表展示状态
 */
function toggleListStatus(): void {
  listStatus.value = !listStatus.value
}
</script>

<template>
  <div id="btn-tech-stack">
    <div id="tech-stack-wrap" v-if="listStatus">
      <TechStackList />
    </div>
    <el-icon id="icon" @click="toggleListStatus"><Tickets /></el-icon>
  </div>
</template>

<style>
#btn-tech-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  right: 0;
  bottom: 0;
  font-size: 2rem;
}

#icon {
  cursor: pointer;
}
</style>
