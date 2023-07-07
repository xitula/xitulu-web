<script setup lang="ts">
import { onMounted } from 'vue';
import TechStack from './components/TechStack.vue'
import { useTechStackStore } from './stores/tech-stack'

onMounted(() => {
  const { setTechStack } = useTechStackStore()
  setTechStack('home')
})
</script>

<template>
  <el-container>
    <el-header>header</el-header>
    <el-main>main</el-main>
    <el-footer>footer</el-footer>
  </el-container>

  <!-- <RouterView /> -->
  <TechStack />
</template>
