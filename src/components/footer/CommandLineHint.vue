<script setup lang="ts">
import { toRefs } from 'vue'
import { useFooterStore } from '../../stores/footer'

const store = useFooterStore()
const { hints } = toRefs(store)
</script>

<template>
  <div
    class="absolute left-0 bottom-24 w-full px-[1.1rem] border border-main-color border-b-0 text-[1.4rem] text-main-color bg-main-background-color"
    v-if="hints.length > 0"
  >
    <div class="item" v-for="item in hints" :key="item">{{ item }}</div>
  </div>
</template>
