<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHeaderStore } from './stores/header'
import Header from './components/RootHeader.vue'
import Footer from './components/footer/RootFooter.vue'
import RBCornerContainer from './components/corner/RBCornerContainer.vue'
import { useTechStackStore } from './stores/tech-stack'

const router = useRouter()
const headerStore = useHeaderStore()

watch(router.currentRoute, (newRouter) => {
  const { path } = newRouter
  let routeName = path.substring(1)
  if (!routeName) routeName = 'home'
  headerStore.changeMenu(routeName)
})

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
  display: flex;
  flex-direction: column;
  color: var(--main-color);
}
#footer {
  display: flex;
}
</style>
