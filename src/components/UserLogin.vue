<script setup lang="ts">
import { toRefs } from 'vue'
import { useUserStore } from '../stores/user'
import MaskLayer from './MaskLayer.vue'

const userStore = useUserStore()
const { showLogin, inputLoginUsername, inputLoginPassword, loginHint, loginLoading } =
  toRefs(userStore)
const { login } = userStore

function handleCancel() {
  showLogin.value = false
}
</script>
<template>
  <MaskLayer v-if="showLogin" @cancel="handleCancel">
    <!-- 登录盒子 -->
    <div
      class="flex flex-col grow-0 justify-between w-[30rem] p-12 border border-main-color bg-main-background-color"
      @click.stop=""
    >
      <!-- 提示信息 -->
      <div class="flex my-4 text-[1.6rem] text-main-color text-center" v-if="loginHint">
        {{ loginHint }}
      </div>
      <!-- 用户名 -->
      <el-input class="pb-4" v-model="inputLoginUsername" />
      <!-- 密码 -->
      <el-input class="pb-4" v-model="inputLoginPassword" type="password" :show-password="true" />
      <!-- 登录按钮 -->
      <el-button class="w-full" @click="login" :loading="loginLoading">登录</el-button>
    </div>
  </MaskLayer>
</template>
