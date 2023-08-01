<script setup lang="ts">
import GoGithub from './GoGithub.vue'
import TechStack from './TechStack.vue'
import TechStackList from './TechStackList.vue'
</script>

<template>
  <div class="fixed right-0 bottom-0 flex flex-col justify-center items-end">
    <!-- 技术栈列表 -->
    <div>
      <TechStackList />
    </div>
    <div class="flex justify-end items-center">
      <!-- 跳转网站 Github 页面 -->
      <GoGithub />
      <!-- 技术栈展示模块 -->
      <TechStack />
    </div>
  </div>
</template>
