<script setup lang="ts">
import { toRefs } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const { showLogin, inputLoginUsername, inputLoginPassword, loginLoading } = toRefs(userStore)
const { login } = userStore
</script>
<template>
  <div
    id="mask"
    class="flex"
    @click="
      () => {
        showLogin = false
      }
    "
    v-if="showLogin"
  >
    <div id="login-box" class="flex">
      <el-input class="input" v-model="inputLoginUsername" />
      <el-input class="input" v-model="inputLoginPassword" type="password" :show-password="true" />
      <el-button id="btn" @click="login" :loading="loginLoading">登陆</el-button>
    </div>
  </div>
</template>
<style scoped>
#mask {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: var(--index-level-9);
}
#login-box {
  flex-direction: column;
  justify-content: space-between;
  width: 30rem;
  padding: 3rem;
  border: 1px solid var(--main-color);
}
.input {
  padding-bottom: 1rem;
}
#btn {
  width: 100%;
}
</style>
