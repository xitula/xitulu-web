<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Vditor from 'vditor/dist/method.min'
import { useArticleStore } from '../../stores/articles'
import EditToolbar from './EditToolbar.vue'

const articleStore = useArticleStore()
const contentRef = ref<HTMLDivElement>()

onMounted(() => {
  // 设置待渲染的 Markdown 内容
  Vditor.preview(contentRef.value, articleStore.content, {
    mode: 'dark',
    theme: {
      current: 'dark',
    },
  })
})
</script>

<template>
  <div>
    <EditToolbar />
    <div ref="contentRef">content</div>
  </div>
</template>
