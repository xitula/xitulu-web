<script setup lang="ts">
import router from '../../router/index'
import { toRefs } from 'vue'
import { useArticleStore } from '../../stores/articles'

const emit = defineEmits(['save'])

const articleStore = useArticleStore()
const { title, saveLoading } = toRefs(articleStore)

function handleBack() {
  router.back()
}

function handleSave() {
  emit('save')
}
</script>

<template>
  <div class="flex justify-between">
    <el-button @click="handleBack">返回</el-button>
    <el-input class="mx-4" v-model="title" placeholder="请输入标题" />
    <el-button @click="handleSave" :disable="saveLoading" :loading="saveLoading">保存</el-button>
  </div>
</template>
