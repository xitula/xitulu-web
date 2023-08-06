<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import EditToolbar from './EditToolbar.vue'
import { useArticleStore } from '../../stores/articles'
import { ElMessage } from 'element-plus'

const articleStore = useArticleStore()
const { title, content } = storeToRefs(articleStore)
const vditorLoading = ref<boolean>(true)
const vditor = ref<Vditor | null>(null)

onMounted(() => {
  vditorLoading.value = true
  vditor.value = new Vditor('vditor', {
    // cdn: 'http://localhost',
    theme: 'dark',
    preview: {
      theme: {
        current: 'dark',
      },
    },
    height: '100%',
    after: () => {
      vditorLoading.value = false
      // vditor.value is a instance of Vditor now and thus can be safely used here
      vditor.value!.setValue(content.value)
    },
  })
})

onBeforeUnmount(() => {
  vditor.value?.destroy()
})

// 将当前文章内容赋值给store并触发保存
function handleDone() {
  if (!articleStore.title) {
    ElMessage({
      type: 'warning',
      message: '标题不能为空',
    })
    return
  }
  const value = vditor.value?.getValue() ?? ''
  if (!value || value === '\n') {
    ElMessage({
      type: 'warning',
      message: '内容不能为空',
    })
    return
  }
  articleStore.content = value
  articleStore.handleDone()
}
</script>

<template>
  <!-- <div class="w-full"></div> -->
  <EditToolbar @done="handleDone" />
  <div class="w-full h-full" id="vditor" v-loading="vditorLoading" />
</template>

<style>
#vditor {
  color: #fff;
}
.vditor-content {
  color: #fff;
}
</style>
