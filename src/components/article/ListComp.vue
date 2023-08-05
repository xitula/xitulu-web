<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articles'

const articleStore = useArticleStore()
const { articles } = storeToRefs(articleStore)
const { fetchArticles } = articleStore

onMounted(() => {
  fetchArticles()
})
</script>
<template>
  <div>
    <div v-for="article in articles" :key="article.id">
      {{ article.title }}
    </div>
  </div>
</template>
