<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articles'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const { mySelf } = storeToRefs(userStore)
const articleStore = useArticleStore()
const { articles } = storeToRefs(articleStore)
const { fetchArticles, setEdit, setCreate, setView } = articleStore

onMounted(() => {
  fetchArticles()
})

function handleCreate() {
  setCreate()
}

function handleStartView(id: number) {
  setView(id)
}

function handleEditStart(id: number) {
  setEdit(id)
}
</script>
<template>
  <div class="flex flex-col p-main-wrap">
    <!-- 头部工具栏 -->
    <div class="flex justify-center items-center">
      <el-icon class="" size="3rem" v-if="mySelf.id !== 0" @click="handleCreate()">
        <EditPen />
      </el-icon>
    </div>
    <!-- 文章列表 -->
    <div class="flex flex-col pt-2 text-common-size">
      <!-- 文章条目 -->
      <div
        class="flex cursor-pointer hover:bg-main-background-color-deep"
        v-for="article in articles"
        :key="article.id"
      >
        <!-- 标题 -->
        <div class="grow" @click="handleStartView(article.id)">
          {{ article.title }}
        </div>
        <!-- 操作区 -->
        <div class="flex justify-center items-center grow-0 shrink-0">
          <!-- 编辑 -->
          <el-icon
            class="w-8 h-8 rounded border border-main-color"
            v-if="article.uid === mySelf.id"
            @click="handleEditStart(article.id)"
          >
            <EditPen />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
