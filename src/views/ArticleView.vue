<script setup lang="ts">
import List from '../components/article/ListComp.vue'
import Edit from '../components/article/EditComp.vue'
import { useArticleStore } from '../stores/articles'
import { ArticleMode } from '../constants/article';

const articleStore = useArticleStore()
</script>

<template>
  <div class="w-full h-full">
    <List v-if="articleStore.mode === ArticleMode.List" />
    <Edit v-else />
  </div>
</template>
