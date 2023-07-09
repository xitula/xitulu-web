<script setup lang="ts">
import { toRefs } from 'vue'
import { useFooterStore } from '../stores/footer'

const store = useFooterStore()
const { hints } = toRefs(store)
</script>

<template>
  <div id="list">
    <div class="item" v-for="item in hints" :key="item">{{ item }}</div>
  </div>
</template>

<style scoped>
#list {
  position: absolute;
  left: 0;
  bottom: 2.2rem;
}
.item {
}
</style>
