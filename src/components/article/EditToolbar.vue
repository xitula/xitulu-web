<script setup lang="ts">
import router from '../../router/index'
import { toRefs } from 'vue'
import { useArticleStore } from '../../stores/articles'
import { ArticleMode } from '../../constants/article';

const emit = defineEmits(['done'])

const articleStore = useArticleStore()
const { mode, title, saveLoading } = toRefs(articleStore)

/**
 * 返回列表页
 */
function handleBack() {
  articleStore.setBack2List()
}

/**
 * 触发保存
 */
function handleDone() {
  emit('done')
}
</script>

<template>
  <div class="flex justify-between">
    <el-button @click="handleBack">返回</el-button>
    <el-input class="mx-4 text-center" v-model="title" placeholder="请输入文章标题" />
    <el-button @click="handleDone" :disable="saveLoading" :loading="saveLoading">{{mode === ArticleMode.Create ? '创建' : '保存'}}</el-button>
  </div>
</template>

<style scoped>
:deep(.el-input__inner) {
  text-align: center;
}
</style>
