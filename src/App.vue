<script setup lang="ts">
import { onMounted } from 'vue'
import Header from './components/RootHeader.vue'
import Footer from './components/footer/RootFooter.vue'
import RBCornerContainer from './components/corner/RBCornerContainer.vue'
import { useTechStackStore } from './stores/tech-stack'

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

  <RBCornerContainer />
</template>

<style scoped>
#body-container {
  max-width: 960px;
  height: 100vh;
}
#main {
  margin-top: -1px;
  padding-top: 1px;
  display: flex;
  flex-direction: column;
}
#footer {
  display: flex;
}
</style>
