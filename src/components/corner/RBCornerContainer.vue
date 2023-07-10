<script setup lang="ts">
import GoGithub from './GoGithub.vue'
import TechStack from './TechStack.vue'
import TechStackList from './TechStackList.vue'
</script>

<template>
  <div id="right-bottom-wrap">
    <div id="list">
      <TechStackList />
    </div>
    <div id="icons">
      <!-- 跳转网站 Github 页面 -->
      <GoGithub />
      <!-- 技术栈展示模块 -->
      <TechStack />
    </div>
  </div>
</template>

<style scoped>
#right-bottom-wrap {
  position: fixed;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
#icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
