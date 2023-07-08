<script setup lang="ts">
import { onMounted } from 'vue'
import TechStack from './components/TechStack.vue'
import { useTechStackStore } from './stores/tech-stack'
import Header from './components/RootHeader.vue'
import Footer from './components/RootFooter.vue'

onMounted(() => {
  const { setTechStack } = useTechStackStore()
  setTechStack('home')
})
</script>

<template>
  <el-container id="body-container">
    <el-header>
      <Header />
    </el-header>
    <el-main id="main">
      <RouterView />
    </el-main>
    <el-footer id="footer">
      <Footer />
    </el-footer>
  </el-container>

  <!-- 技术栈展示模块 -->
  <TechStack />
</template>

<style scoped>
#body-container {
  max-width: 960px;
  min-height: 100vh;
}
#main {
  flex-grow: 1;
}
#footer {
  display: flex;
  align-items: center;
}
</style>
