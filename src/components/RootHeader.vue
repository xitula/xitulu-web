<script setup lang="ts">
import { toRefs } from 'vue'
import { useHeaderStore } from '../stores/header'

const store = useHeaderStore()
const { currentMenu } = toRefs(store)
const { changeMenu } = store

/**
 * 菜单选择时的处理函数
 * @param routeName 路由名称
 */
function handleSelect(routeName: string): void {
  changeMenu(routeName)
}
</script>

<template>
  <el-menu :default-active="currentMenu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="home">首页</el-menu-item>
    <el-menu-item index="tool">工具</el-menu-item>
    <el-menu-item index="blog">博客</el-menu-item>
    <el-menu-item index="causerie">随感</el-menu-item>
    <el-menu-item index="todo">待办</el-menu-item>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
</template>
