<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'
import { useHeaderStore } from './stores/header'
import { useTechStackStore } from './stores/tech-stack'
import Header from './components/RootHeader.vue'
import UserLogin from './components/UserLogin.vue'
import Footer from './components/footer/RootFooter.vue'
import RBCornerContainer from './components/corner/RBCornerContainer.vue'
import { error } from './utils/logger'

const router = useRouter()
const userStore = useUserStore()
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

  // 根据Session存储恢复登录状态
  const mySelfStr = sessionStorage.getItem('mySelf') ?? '{}'
  try {
    const mySelf = JSON.parse(mySelfStr)
    if (mySelf && mySelf?.id !== 0) {
      userStore.mySelf = mySelf
    }
  } catch (err) {
    error('JSON解析错误:', err)
  }
})
</script>

<template>
  <el-container class="max-w-[960px] h-full">
    <el-header>
      <Header />
    </el-header>
    <el-main class="flex flex-col -mt-[1px] text-main-color">
      <RouterView />
    </el-main>
    <el-footer class="flex">
      <Footer />
    </el-footer>
  </el-container>

  <RBCornerContainer />
  <UserLogin />
</template>
