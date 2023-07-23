<script setup lang="ts">
import { toRefs } from 'vue'
import { useFooterStore } from '../../stores/footer'

const store = useFooterStore()
const { hints } = toRefs(store)
</script>

<template>
  <div id="list" v-if="hints.length > 0">
    <div class="item" v-for="item in hints" :key="item">{{ item }}</div>
  </div>
</template>

<style scoped>
#list {
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 6rem;
  padding: 0 1.1rem;
  border: 1px solid var(--main-color);
  border-bottom: none;
  font-size: 1.4rem;
  color: var(--main-color);
  background-color: var(--main-background-color);
}
</style>
