<script setup lang="ts">
import { onMounted } from 'vue'
import { useTechStackStore } from '../stores/tech-stack'

onMounted(() => {
  const { setTechStack } = useTechStackStore()
  setTechStack('home')
})
</script>

<template>
  <main>首页</main>
</template>
