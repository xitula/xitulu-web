<script setup lang="ts">
import { toRefs } from 'vue'
import { useCauserieStore } from '../../stores/causerie'
import { useUserStore } from '../../stores/user'

defineProps<{
  item: Causerie
}>()

const userStore = useUserStore()
const causerieStore = useCauserieStore()
const { mySelf } = toRefs(userStore)

function handleEdit(item: Causerie): void {
  causerieStore.setEdit(item)
}
</script>

<template>
  <div
    class="causerie-wrap grow flex justify-start items-start mb-8 text-main-color hover:bg-main-background-color-deep"
  >
    <!-- 头像容器 -->
    <div class="grow-0 shrink-0 justify-between">
      <div class="w-20 h-20 rounded-[3px] overflow-hidden">
        <el-icon><Avatar /></el-icon>
      </div>
    </div>
    <!-- 用户内容容器 -->
    <div class="grow flex flex-col pl-4">
      <!-- 用户信息 -->
      <div class="flex justify-between items-center pr-4">
        <div class="text-[3rem] font-bold">{{ item.uid }}</div>
        <!-- 操作按钮 -->
        <div class="causerie-actions hidden" v-if="item.uid === mySelf.id">
          <div class="w-12 h-12 hover:border border-main-color">
            <el-icon class="w-full h-full" @click="handleEdit(item)"><EditPen /></el-icon>
          </div>
          <div
            class="w-12 h-12 ml-4 hover:border border-main-color"
            @click="causerieStore.deleteCauserie(item.id)"
          >
            <el-icon class="w-full h-full"><Delete /></el-icon>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="grow text-[2rem]">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@tailwind components;
@layer components {
  .causerie-wrap:hover .causerie-actions {
    @apply flex;
  }
}
</style>
