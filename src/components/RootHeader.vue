<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeIndex = ref<string>('home')

/**
 * 菜单选择时的处理函数
 * @param routeName 路由名称
 */
function handleSelect(routeName: string): void {
  router.push({
    name: routeName
  })
}
</script>

<template>
  <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
    <el-menu-item index="home">首页</el-menu-item>
    <el-menu-item index="tool">工具</el-menu-item>
    <el-menu-item index="blog">博客</el-menu-item>
    <el-menu-item index="causerie">随感</el-menu-item>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
</template>
