<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useCauserieStore } from '../stores/causerie'
import Item from '../components/causerie/ItemComp.vue'
import { onMounted, toRefs } from 'vue'
import CreateComp from '../components/causerie/CreateComp.vue'

const userStore = useUserStore()
const causerieStore = useCauserieStore()

const { mySelf } = toRefs(userStore)
const { createLayerShow } = toRefs(causerieStore)
const { fetchCauseries } = causerieStore

onMounted(() => {
  fetchCauseries()
})

function handleToggleCreate() {
  const { id } = mySelf.value
  if (id === 0) {
    userStore.loginHint = '需要登录之后才能创建新的随感'
    userStore.showLogin = true
  } else {
    createLayerShow.value = createLayerShow.value ? false : true
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full p-[--main-padding]">
    <!-- 新增按钮 -->
    <div class="right-0 top-0 w-12 h-12" @click="handleToggleCreate">
      <el-icon class="w-full"><EditPen /></el-icon>
    </div>
    <!-- 随感列表 -->
    <div class="flex flex-col p-[--main-padding]">
      <Item v-for="item in causerieStore.causeries" :key="item.id" :item="item" />
    </div>
    <CreateComp />
  </div>
</template>

<style scoped>
:deep(.el-icon) {
  width: 100%;
  height: 100%;
}
:deep(.el-icon svg) {
  width: 100%;
  height: 100%;
}
</style>
