<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import EditToolbar from './EditToolbar.vue'
import { useArticleStore } from '../../stores/articles'

const articleStore = useArticleStore()

const vditor = ref<Vditor | null>(null)

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    theme: 'dark',
    height: '100%',
    after: () => {
      // vditor.value is a instance of Vditor now and thus can be safely used here
      vditor.value!.setValue('Vue Composition API + Vditor + TypeScript Minimal Example')
    },
  })
})

onBeforeUnmount(() => {
  vditor.value?.destroy()
})

// 将当前文章内容赋值给store并触发保存
function handleSave() {
  const value = vditor.value?.getValue() ?? ''
  articleStore.content = value
  articleStore.handleSave()
}
</script>

<template>
  <EditToolbar @save="handleSave" />
  <div id="vditor" />
</template>

<style>
#vditor {
  color: #fff;
}
.vditor-content {
  color: #fff;
}
</style>
