<script setup lang="ts">
import { useCauserieStore } from '../stores/causerie'
import Item from '../components/causerie/ItemComp.vue'
import { onMounted } from 'vue'

const causerieStore = useCauserieStore()

const { fetchCauseries } = causerieStore

onMounted(() => {
  fetchCauseries()
})
</script>

<template>
  <div id="wrap">
    <div id="list">
      <Item v-for="item in causerieStore.causeries" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped>
#wrap {
  padding: var(--main-padding);
}
</style>
